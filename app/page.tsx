'use client'

import { SubmitEvent } from 'react'

export default function Home() {
  const onSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
  };

  return (
    <main className="flex flex-col flex-1 items-center justify-center font-sans">
      <div className="flex flex-col w-sm md:w-xl rounded-xl bg-foreground text-background overflow-hidden shadow-lg gap-4 p-4">
        <form onSubmit={onSubmit}>
          <label htmlFor="repos" className="block cursor-default">Insert GitHub repositories (separated by spaces)</label>

          <textarea
            id="repos"
            name="repos"
            rows={4}
            className="bg-neutral-secondary-medium border border-default-medium rounded-lg block w-full p-3.5 shadow-xs placeholder:text-body resize-none"
            placeholder="github.com/rakin406/gitro">
          </textarea>

          <div className="flex justify-center">
            <button
              type="submit"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#E93636] px-5 text-zinc-50 md:w-[158px] cursor-pointer"
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
