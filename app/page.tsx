'use client'

import { useState, SubmitEvent } from 'react';
import { toast } from 'sonner';

interface LeaderboardItem {
  rank: number;
  owner: string;
  repo: string;
  totalCommitsLastYear: number;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);

  const onSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const reposText = formData.get("repos")?.toString().trim();

      // Handle empty input
      if (!reposText) {
        throw new Error("Cannot submit empty data.");
      }

      // Split repositories by space or comma
      const repos = reposText.split(/[\s,]+/).map((s) => s.trim());

      // Get only unique repositories
      const uniqueRepos = [...new Set(repos)];

      // Repositories cannot be less than 2
      if (uniqueRepos.length < 2) {
        throw new Error("Minimum 2 unique repositories are required.");
      }

      // Repositories cannot be more than 10
      if (uniqueRepos.length > 10) {
        throw new Error("Maximum 10 repositories are allowed.");
      }

      // Data to send to the API
      const payload = {
        repos: uniqueRepos,
      };

      const response = await fetch("/api/maintained?version=1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to submit the data. Please try again.");
      }

      // Show results
      const data = await response.json();
      setLeaderboard(data["leaderboard"]);
    } catch (error: unknown) {
      // Capture the error message to display to the user
      const message = error instanceof Error
        ? error.message
        : typeof error === 'string'
          ? error
          : JSON.stringify(error);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col flex-1 items-center justify-center font-sans gap-8 p-4">
      <form
        onSubmit={onSubmit}
        className="flex flex-col w-sm md:w-xl rounded-xl bg-foreground text-background overflow-hidden shadow-lg gap-4 p-4"
      >
        <label htmlFor="repos" className="block cursor-default">Insert GitHub repositories</label>

        <textarea
          id="repos"
          name="repos"
          rows={4}
          className="bg-neutral-secondary-medium border border-default-medium block w-full p-3.5 shadow-xs placeholder:text-body resize-none"
          placeholder="Type here..."
          required
        ></textarea>

        <div className="flex justify-center">
          <button
            type="submit"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#E93636] px-5 text-zinc-50 md:w-[158px] cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : "Search"}
          </button>
        </div>
      </form>

      {leaderboard.length > 0 && (
        <div className="w-sm md:w-xl">
          <h2 className="text-2xl text-center font-bold mb-4 cursor-default">Leaderboard</h2>
          <div className="flex flex-col max-h-80 overflow-y-auto gap-2 
            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:rounded-lg
            [&::-webkit-scrollbar-thumb]:rounded-lg
            [&::-webkit-scrollbar-track]:bg-gray-200 
            [&::-webkit-scrollbar-thumb]:bg-gray-500">
            {leaderboard.map((item) => (
              <div
                key={`${item.owner}/${item.repo}`}
                className="flex items-center justify-between bg-foreground text-background rounded-lg p-4 shadow"
              >
                <div className="flex items-center gap-4">
                  <span className="text-xl font-bold">#{item.rank}</span>
                  <div>
                    <a
                      href={`https://github.com/${item.owner}/${item.repo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold cursor-pointer"
                    >
                      {item.owner}/{item.repo}
                    </a>
                    <div className="text-sm opacity-75">{item.totalCommitsLastYear} commits last year</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
