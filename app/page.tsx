'use client'

import { useState, SubmitEvent } from 'react';
import { Toaster, toast } from 'sonner';

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null); // Clear previous errors when a new request starts

    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch("/api/maintained?version=1", {
        method: 'GET',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to submit the data. Please try again.');
      }

      const data = await response.json();
    } catch (err: any) {
      // Capture the error message to display to the user
      setError(err.message);
      toast(error);
    } finally {
    }
  };

  return (
    <main className="flex flex-col flex-1 items-center justify-center font-sans">
      <Toaster />
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
          >
            Search
          </button>
        </div>
      </form>
    </main>
  );
}
