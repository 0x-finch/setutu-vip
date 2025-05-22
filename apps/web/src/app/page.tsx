import { PhotoCarousel } from "src/components/photo-carousel";
import { RotateButton } from "src/components/rotate-button";
import { pgQueryImages } from "src/libs/pg-client";

export default async function HomePage() {
  const randomImages = await pgQueryImages(20);
  return (
    <div className="flex flex-col items-center gap-4 mx-auto max-w-7xl w-full p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold">涩兔兔</h1>
      <PhotoCarousel randomImages={randomImages} />
      <RotateButton />
    </div>
  );
}
