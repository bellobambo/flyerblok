"use client";

const BackButton = () => {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <button
      onClick={handleBack}
      className="mx-4 hover:underline mb-4 inline-block"
    >
      ← Go Back
    </button>
  );
};

export default BackButton;
