import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

const schema = z.object({
  // Repositories
  repos: z.array(
    z
      .string()
      .trim()
      .regex(
        /^((http|https):\/\/)?(www\.)?github\.com\/([a-zA-Z0-9](?:-(?=[a-zA-Z0-9])|[a-zA-Z0-9]){0,38}(?<=[a-zA-Z0-9]))\/\S+$/,
      ),
  ),
});

export async function GET(req: NextRequest) {
  const parsed = schema.parse(req.body);
  console.log(parsed.repos);
  return NextResponse.json({});
}
