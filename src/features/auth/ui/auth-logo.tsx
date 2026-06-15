import Image from "next/image";
import Link from "next/link";

import { AUTH_LOGO } from "../constants";

export function AuthLogo() {
  return (
    <Link href="/" className="relative block shrink-0">
      <Image
        src={AUTH_LOGO.light}
        alt="Qodest"
        width={612}
        height={408}
        className="h-24 w-auto object-contain dark:hidden"
        priority
      />
      <Image
        src={AUTH_LOGO.dark}
        alt="Qodest"
        width={612}
        height={408}
        className="hidden h-24 w-auto object-contain dark:block"
        priority
      />
    </Link>
  );
}
