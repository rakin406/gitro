import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";
import { getOctokit } from "@/lib/octokit";
import logger from "@/lib/logger";

interface GitHub {
  owner: string;
  repo: string;
}

interface GitHubStats extends GitHub {
  totalCommitsLastYear: number;
}

interface LeaderboardItem extends GitHubStats {
  rank: number;
}

interface Result {
  leaderboard: LeaderboardItem[];
}

// Helper function to normalize repo URLs to "owner/repo" format
function normalizeRepo(input: string): string {
  let normalized = input.trim();

  // Remove protocol (http://, https://)
  normalized = normalized.replace(/^https?:\/\//, "");

  // Remove www.
  normalized = normalized.replace(/^www\./, "");

  // Remove github.com/
  normalized = normalized.replace(/^github\.com\//, "");

  // Remove query parameters and fragments
  normalized = normalized.replace(/[?#].*$/, "");

  // Extract only owner/repo (first two path segments)
  const segments = normalized.split("/").filter((s) => s.length > 0);
  if (segments.length >= 2) {
    normalized = `${segments[0]}/${segments[1]}`;
  }

  return normalized;
}

const schema = z.object({
  // Repositories
  repos: z
    .array(
      z
        .string()
        .trim()
        .transform(normalizeRepo)
        .pipe(
          z
            .string()
            .regex(
              /^[a-zA-Z0-9](?:-(?=[a-zA-Z0-9])|[a-zA-Z0-9]){0,38}(?<=[a-zA-Z0-9])\/[a-zA-Z0-9_.-]+$/,
              "Must be a valid GitHub repository in owner/repo format",
            ),
        ),
    )
    .min(2)
    .max(10)
    .refine((items) => new Set(items).size === items.length, {
      message: "Must be an array of unique repositories",
    }),
});

export async function POST(req: NextRequest) {
  // Parse JSON with error handling
  let body: unknown;
  try {
    body = await req.json();
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON format" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to parse request body" },
      { status: 400 },
    );
  }

  // Validate schema with error handling
  const parseResult = schema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parseResult.error.issues },
      { status: 422 },
    );
  }

  const parsed = parseResult.data;
  const github: GitHub[] = [];
  const stats: GitHubStats[] = [];
  const leaderboard: LeaderboardItem[] = [];

  // Initialize octokit
  let octokit;
  try {
    octokit = await getOctokit();
  } catch (error) {
    const message = "Failed to initialize GitHub client";
    logger.error({ error, message: message });
    return NextResponse.json({ error: message }, { status: 500 });
  }

  // Extract all usernames and repositories
  for (const repo of parsed.repos) {
    const matches = [...repo.matchAll(/[^\/\s]+/g)];

    // Username and repository must exist
    if (matches.length < 2) {
      return NextResponse.json(
        { error: "Username/repository is missing" },
        { status: 422 },
      );
    }

    // Get username and repository
    const username = matches.at(-2)?.toString() ?? "";
    const repository = matches.at(-1)?.toString() ?? "";

    github.push({
      owner: username,
      repo: repository,
    });
  }

  for (const i of github) {
    try {
      const maxAttempts = 5;
      let attempt = 0;
      let response;

      // Retry loop with exponential backoff for 202 responses
      while (attempt < maxAttempts) {
        response = await octokit.rest.repos.getCommitActivityStats({
          owner: i.owner,
          repo: i.repo,
        });

        if (response.status === 202) {
          attempt++;
          if (attempt < maxAttempts) {
            // Exponential backoff: 1s, 2s, 4s, 8s
            const delay = Math.pow(2, attempt - 1) * 1000;
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        } else {
          // Success - process the data
          break;
        }
      }

      if (!response) continue;

      if (response.status === 202) {
        // Still getting 202 after maxAttempts
        logger.warn({
          message: "GitHub API still computing commit stats after retries",
          owner: i.owner,
          repo: i.repo,
          attempts: maxAttempts,
        });
        stats.push({
          ...i,
          totalCommitsLastYear: 0,
        });
      } else {
        // Successfully got data
        const totalCommitsLastYear = response.data.reduce(
          (accumulator, commit) => accumulator + commit.total,
          0, // Initial value
        );

        stats.push({
          ...i,
          totalCommitsLastYear: totalCommitsLastYear,
        });
      }
    } catch (error) {
      logger.error({ error, owner: i.owner, repo: i.repo });
    }
  }

  // Sort highest to lowest
  const sortedStats = stats.sort(
    (a, b) => b.totalCommitsLastYear - a.totalCommitsLastYear,
  );

  sortedStats.forEach((value, index) => {
    leaderboard.push({
      rank: index + 1,
      ...value,
    });
  });

  const result: Result = {
    leaderboard: leaderboard,
  };

  return NextResponse.json(result);
}
