import { ReactNode } from "react";

export interface IChildren {
  children: ReactNode;
}

export default interface IClassName {
  className?: string;
}

export interface NavItem {
  id: number;
  title: string;
  href: string;
}
