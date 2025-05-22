import NextImage from "next/image";
import { RotateButton } from "src/components/rotate-button";
import { pgQueryImages } from "src/libs/pg-client";
import { Image } from "src/types";

export default async function HomePage() {
  const randomImages = await pgQueryImages();
  return (
    <div className="flex flex-col items-center gap-4 mx-auto max-w-7xl w-full p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold">涩兔兔</h1>
      <div className="grid grid-cols-3 grid-rows-3 gap-4 w-96 h-96">
        {randomImages?.map((image: Image, idx: number) => (
          <NextImage
            key={idx}
            src={image.url}
            alt={image.sttid}
            className="object-cover w-full h-full p-2"
            loading="lazy"
            width={117}
            height={117}
          />
        ))}
      </div>
      <RotateButton />
    </div>
  );
}
