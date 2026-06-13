import AlsamaLogoSvg from "@/components/common/AlsamaLogoSvg";

type TClassicUmrahPageHeaderProps = {
  /** Horizontal page margin; vertical rhythm is identical on every page. */
  marginPx: number;
};

/**
 * Salam greeting + brand logo, single source of truth for every classic
 * Umrah page header so sizes stay identical to the intro page (page 2).
 */
export function ClassicUmrahPageHeader({ marginPx }: TClassicUmrahPageHeaderProps) {
  return (
    <header
      className="flex shrink-0 items-center justify-between pt-8 pb-4"
      style={{ paddingLeft: marginPx, paddingRight: marginPx }}
    >
      <p
        className="max-w-[58%] font-serif text-xl leading-[1.15] text-slate-800"
        dir="rtl"
        lang="ar"
      >
        السلام عليكم
      </p>
      <AlsamaLogoSvg />
    </header>
  );
}
