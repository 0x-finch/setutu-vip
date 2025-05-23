"use client";

import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { Image } from "src/types";

export const PhotoCarousel = ({ randomImages }: { randomImages?: Image[] }) => {
  return (
    <PhotoProvider>
      <div className="grid grid-cols-2 xl:grid-cols-4 grid-rows-10 xl:grid-rows-5 gap-4 w-96 xl:w-192 h-fit">
        {randomImages?.map((image: Image, index: number) => (
          <PhotoView key={index} src={image.url}>
            <img
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
