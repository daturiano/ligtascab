interface SectionHeaderProps {
  title: string;
  description: string;
  subtitle: string;
}

export default function SectionHeader({
  title,
  description,
  subtitle,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:gap-8">
      <h3 className="text-primary font-bold md:text-2xl">{title}</h3>
      <div className="flex flex-col items-center justify-center space-y-2 tracking-tight md:space-y-6">
        <h4 className="leading-tighter text-xl font-semibold tracking-tighter text-balance md:text-5xl md:text-pretty">
          {subtitle}
        </h4>
        <h5 className="max-w-[60ch] text-sm leading-tight font-normal text-balance text-black/80 md:text-xl">
          {description}
        </h5>
      </div>
    </div>
  );
}
