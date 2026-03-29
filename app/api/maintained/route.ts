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
        .trim()
        .regex(
          /^((http|https):\/\/)?(www\.)?(github\.com\/)?([a-zA-Z0-9](?:-(?=[a-zA-Z0-9])|[a-zA-Z0-9]){0,38}(?<=[a-zA-Z0-9]))\/\S+$/,
        ),
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

  for (const repo of parsed.repos) {
    // TODO
  }

  return NextResponse.json({});
}
