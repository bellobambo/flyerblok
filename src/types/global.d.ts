import "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "css-doodle": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        ["click-to-update"]?: boolean | string;
        // Add other css-doodle specific attributes if needed
      };
    }
  }
}
