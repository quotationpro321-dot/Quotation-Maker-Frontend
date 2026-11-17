import Image from "next/image";
import Link from "next/link";

import { AUTH_LOGO } from "../constants";

export function AuthLogo() {
  return (
    <Link href="/" className="relative block shrink-0">
      <Image
        src={AUTH_LOGO.light}
        alt="Alsama"
        width={3000}
        height={3000}
        className="size-40 object-contain dark:hidden sm:size-48"
        priority
      />
      <Image
        src={AUTH_LOGO.dark}
        alt="Alsama"
        width={3000}
        height={3000}
        className="hidden size-40 object-contain dark:block sm:size-48"
        priority
      />
    </Link>
  );
}
