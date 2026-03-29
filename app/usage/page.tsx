export default function Page() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <div className="relative bottom-20 w-sm md:w-xl text-center leading-8">
        <h2 className="text-xl">
          <em><strong>Gitro</strong></em> lets you check the most maintained GitHub repositories.
        </h2>

        <br />

        <h3 className="text-lg">
          <strong>Usage:</strong>
        </h3>

        <ul className="list-inside list-disc text-left">
          <li>
            Insert GitHub repositories separated by commas, spaces, or newlines.
            At least <strong>two</strong> repositories are required.
          </li>
          <li>Repositories can be in link or "owner/repo" formats.</li>
          <li>Repositories must be <strong>public</strong> and <strong>unique</strong>.</li>
        </ul>
      </div>
    </div>
  );
}
