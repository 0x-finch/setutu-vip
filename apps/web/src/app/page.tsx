import { Suspense } from "react";
import { PhotoFetch } from "src/components/photo-fetch";
import { RotateButton } from "src/components/rotate-button";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  return (
    <div className="flex flex-col items-center gap-4 mx-auto mb-20 p-4 max-w-7xl w-full bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold">涩兔兔</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <PhotoFetch />
      </Suspense>
      <RotateButton />
    </div>
  );
}
