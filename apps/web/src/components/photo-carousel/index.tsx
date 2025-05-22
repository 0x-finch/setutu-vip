"use client";

import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import NextImage from "next/image";
import { Image } from "src/types";

export const PhotoCarousel = ({
  randomImages,
}: {
  randomImages: Image[] | null;
}) => {
  return (
    <PhotoProvider>
      <div className="grid grid-cols-2 grid-rows-6 gap-4 w-96 h-fit">
        {randomImages?.map((image: Image, index: number) => (
          <PhotoView key={index} src={image.url}>
            <NextImage
              key={index}
              src={image.url}
              alt={image.sttid}
              className="object-cover w-full h-full p-2"
              loading="lazy"
              width={184}
              height={64}
            />
          </PhotoView>
        ))}
      </div>
    </PhotoProvider>
  );
};
