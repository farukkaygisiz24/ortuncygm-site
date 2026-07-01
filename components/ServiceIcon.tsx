export type IconKey = "clipboard" | "warehouse" | "truck" | "certificate" | "badge" | "layers";

export default function ServiceIcon({ icon, className }: { icon: IconKey; className?: string }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };

  switch (icon) {
    case "clipboard":
      return (
        <svg {...common}>
          <rect x="6" y="4" width="12" height="17" rx="2" />
          <rect x="9" y="2.3" width="6" height="3" rx="1" />
          <line x1="8.5" y1="10" x2="15.5" y2="10" />
          <line x1="8.5" y1="13.5" x2="15.5" y2="13.5" />
          <line x1="8.5" y1="17" x2="13" y2="17" />
        </svg>
      );
    case "warehouse":
      return (
        <svg {...common}>
          <path d="M3 10.5 12 4l9 6.5" />
          <path d="M5 9.5V20h14V9.5" />
          <rect x="10" y="14" width="4" height="6" />
        </svg>
      );
    case "truck":
      return (
        <svg {...common}>
          <rect x="2" y="7" width="12" height="9" />
          <path d="M14 10h4l3 3v3h-7z" />
          <circle cx="7" cy="18" r="1.6" />
          <circle cx="17.5" cy="18" r="1.6" />
        </svg>
      );
    case "certificate":
      return (
        <svg {...common}>
          <circle cx="12" cy="9" r="5.5" />
          <path d="M9 13.5 7.5 21l4.5-2.5 4.5 2.5-1.5-7.5" />
          <path d="M9.5 9l1.7 1.7L14.5 7" />
        </svg>
      );
    case "badge":
      return (
        <svg {...common}>
          <path d="M12 3 19 6v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
          <path d="M9 12l2 2 4-4.5" />
        </svg>
      );
    case "layers":
    default:
      return (
        <svg {...common}>
          <path d="M12 3 21 8l-9 5-9-5z" />
          <path d="M3 12l9 5 9-5" />
          <path d="M3 16l9 5 9-5" />
        </svg>
      );
  }
}
