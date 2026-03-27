export default function Home() {
  return (
    <main className="flex flex-col flex-1 items-center justify-center font-sans">
      <div className="flex flex-col w-sm md:w-xl rounded-xl bg-foreground text-background overflow-hidden shadow-lg gap-4 p-4">
        <p className="cursor-default">
          Insert GitHub repositories (separated by spaces)
        </p>

        <div className="flex justify-center">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#E93636] px-5 text-zinc-50 md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Search
          </a>
        </div>
      </div>
    </main>
  );
}
