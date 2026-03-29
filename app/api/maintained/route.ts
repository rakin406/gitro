import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";
import octokit from "@/lib/octokit";

interface GitHubInfo {
  user: string;
  repo: string;
}

const schema = z.object({
  // Repositories
  repos: z
    .array(
      z
        .string()
        .regex(
          /((http|https):\/\/)?(www\.)?(github\.com\/)?([a-zA-Z0-9](?:-(?=[a-zA-Z0-9])|[a-zA-Z0-9]){0,38}(?<=[a-zA-Z0-9]))\/\S+/,
        )
        .trim(),
    )
    .min(2)
    .refine((items) => new Set(items).size === items.length, {
      message: "Must be an array of unique strings",
    }),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.parse(body);
  const info: GitHubInfo[] = [];

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

    info.push({
      user: username,
      repo: repository,
    });
  }

  return NextResponse.json({});
}
