"use client";

export const RotateButton = () => {
  return (
    <button
      className="bg-blue-500 text-white p-2 rounded-md cursor-pointer"
      onClick={() => {
        window.location.reload();
      }}
    >
      换一批
    </button>
  );
};
