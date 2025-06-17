"use client";

import { usePathname } from "next/navigation";

const BackButton = () => {
  const pathname = usePathname();
  const isHomepage = pathname === "/";

  const handleBack = () => {
    window.history.back();
  };

  // Don't render if on homepage
  if (isHomepage) return null;

  return (
    <button
      onClick={handleBack}
      className="mx-4 hover:underline mb-4 inline-block cursor-pointer"
    >
      ← Go Back
    </button>
  );
};

export default BackButton;
