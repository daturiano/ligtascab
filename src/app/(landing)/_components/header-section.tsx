import DownloadButton from "./download-button";

export default function HeaderSection() {
  return (
    <section
      id="home"
      className="flex translate-y-24 flex-col items-center justify-center gap-8 px-4 text-center"
    >
      <div className="text-5xl font-bold tracking-tighter md:text-7xl">
        <h1>Ligtascab, A Smarter Way To</h1>
        <h1 className="text-primary">Commute With Ease.</h1>
      </div>
      <p className="font-regular max-w-(--breakpoint-xl) text-lg text-pretty text-black/80 md:max-w-[50ch] md:text-xl md:text-pretty">
        Systemizing your daily travel by combining convenience, comfort, and
        efficiency for a stress-free journey every time.
      </p>
      <DownloadButton />
    </section>
  );
}
