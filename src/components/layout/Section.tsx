import type { ReactNode } from "react";

export default function Section({
  children,
  className = "",
  id,
  ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  ariaLabel?: string;
}) {
  const CompTag = "section";
  return (
    <CompTag
      id={id}
      aria-label={ariaLabel}
      className={["py-12 sm:py-16", className].join(" ")}
    >
      {children}
    </CompTag>
  );
}

