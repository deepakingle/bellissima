import type { ReactNode } from "react";

export default function SectionHeading({
  title,
  eyebrow,
  subtitle,
  align = "left",
  children,
}: {
  title: ReactNode;
  eyebrow?: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
  children?: ReactNode;
}) {
  const alignClasses =
    align === "center"
      ? "text-center items-center"
      : "text-left items-start";

  return (
    <div className={["flex flex-col", alignClasses].join(" ")}>
      {eyebrow ? (
        <p className="text-xs tracking-widest uppercase text-neutral-600">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-3 text-neutral-600 max-w-2xl">{subtitle}</p>
      ) : null}
      {children ? <div className="mt-6">{children}</div> : null}
    </div>
  );
}

