import Link from "next/link";
import AlsamaFaviconSvg from "./AlsamaFaviconSvg";

type AlsamaFaviconProps = {
  className?: string;
  href?: string;
};

const AlsamaFavicon = ({ className, href = "/" }: AlsamaFaviconProps) => {
  return (
    <Link href={href} className="inline-flex">
      <AlsamaFaviconSvg className={className} />
    </Link>
  );
};

export default AlsamaFavicon;
