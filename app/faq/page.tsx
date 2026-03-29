export default function Page() {
  return (
    <div className="flex flex-col flex-1 items-center font-sans">
      <div className="relative top-10 w-sm md:w-xl text-center leading-8">
        <h2 className="text-2xl font-semibold">
          Frequently Asked Questions
        </h2>

        <br />

        <ul className="list-inside list-disc text-pretty">
          <li className="font-semibold">
            Why did you make this website?
            <p className="font-normal text-left">
              As developers, we sometimes get confused about what framework
              to choose for our next project. It&apos;s important to choose
              a framework that is maintained and has not <i>turned to dust</i>.
              That&apos;s why I created this website to find out the most
              maintained projects from a list of GitHub repositories.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}
