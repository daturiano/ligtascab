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
      <div className="space-y-2 tracking-tight md:space-y-6">
        <h4 className="text-xl leading-tight font-semibold tracking-tighter text-pretty md:text-5xl">
          {subtitle}
        </h4>
        <h5 className="text-sm leading-tight font-normal text-pretty text-black/80 md:text-xl md:text-balance">
          {description}
        </h5>
      </div>
    </div>
  );
}
