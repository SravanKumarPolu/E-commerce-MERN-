import React from "react";

interface CrossIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  title?: string;
}

const CrossIcon: React.FC<CrossIconProps> = ({
  className = "w-5 h-5",
  title = "Close",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 16 16"
    className={className}
    aria-hidden={props["aria-label"] ? undefined : "true"}
    focusable="false"
    role={props["aria-label"] ? "img" : undefined}
    {...props}
  >
    {title && <title>{title}</title>}
    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
  </svg>
);

export default CrossIcon;
