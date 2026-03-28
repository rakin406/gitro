'use client'

import { useState, SubmitEvent } from 'react';
import { toast } from 'sonner';

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const reposText = formData.get("repos");

      // Handle null input
      if (!reposText) {
        throw new Error("Cannot submit empty data.");
      }

      const response = await fetch("/api/maintained?version=1", {
        method: 'GET',
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit the data. Please try again.");
      }

      const data = await response.json();
    } catch (error: any) {
      // Capture the error message to display to the user
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col flex-1 items-center justify-center font-sans">
      <form
        onSubmit={onSubmit}
        className="flex flex-col w-sm md:w-xl rounded-xl bg-foreground text-background overflow-hidden shadow-lg gap-4 p-4"
      >
        <label htmlFor="repos" className="block cursor-default">Insert GitHub repositories (separated by spaces)</label>

        <textarea
          id="repos"
          name="repos"
          rows={4}
          className="bg-neutral-secondary-medium border border-default-medium rounded-lg block w-full p-3.5 shadow-xs placeholder:text-body resize-none"
          placeholder="github.com/rakin406/gitro"
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
    </main>
  );
}
