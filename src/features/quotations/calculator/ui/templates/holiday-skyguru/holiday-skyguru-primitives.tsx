import {
  HOLIDAY_PDF_BLUE,
  HOLIDAY_PDF_BLUE_SOFT,
} from "@/features/quotations/calculator/lib/quotation-holiday-skyguru.constants";

export function HolidaySectionHeading({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="px-3 py-1.5 text-[14px] font-bold text-white"
      style={{ backgroundColor: HOLIDAY_PDF_BLUE }}
    >
      {children}
    </div>
  );
}

export function HolidayInfoRow({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: React.ReactNode;
  emphasis?: boolean;
}) {
  return (
    <div className="flex border border-t-0 border-slate-300 text-[12.5px]">
      <div
        className="w-[190px] shrink-0 border-r border-slate-300 px-3 py-1.5 font-semibold text-slate-700"
        style={{ backgroundColor: HOLIDAY_PDF_BLUE_SOFT }}
      >
        {label}
      </div>
      <div
        className={`flex-1 px-3 py-1.5 text-slate-900 ${emphasis ? "font-bold" : ""}`}
      >
        {value}
      </div>
    </div>
  );
}

export function HolidayBulletList({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.slice(0, 48)} className="flex gap-2.5 text-[12.5px] leading-snug text-slate-800">
          <span
            className="mt-[7px] size-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: HOLIDAY_PDF_BLUE }}
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
