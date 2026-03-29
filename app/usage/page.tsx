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
        <p>Insert GitHub repositories separated by commas, spaces, or newlines.</p>
        <p>Repositories can be in link or "owner/repo" formats.</p>
        <p>Repositories must be <strong>public</strong> and <strong>unique</strong>.</p>
      </div>
    </div>
  );
}
