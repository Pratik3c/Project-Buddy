import { type ReactNode } from "react";

/** Handwritten text accent using Caveat font. */
export function Handwritten({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`font-handwritten text-primary/90 ${className}`}
      style={{ fontFamily: '"Caveat", "Comic Sans MS", cursive' }}
    >
      {children}
    </span>
  );
}

/** Curved arrow drawn as SVG. Rotate/flip via className. */
export function CurvedArrow({
  className = "",
  flip = false,
}: {
  className?: string;
  flip?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 120 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
    >
      <path
        d="M8 12 C 30 10, 70 6, 100 30 C 108 36, 110 48, 96 62"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M84 56 L 96 62 L 92 50"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}