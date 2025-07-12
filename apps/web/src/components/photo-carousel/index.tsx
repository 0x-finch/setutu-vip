"use client";

import { useEffect, useRef, useState } from "react";
import { PhotoSlider } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { Image } from "src/types";

export const PhotoCarousel = ({ randomImages }: { randomImages?: Image[] }) => {
  const count = randomImages?.length ?? 0;
  const rows = Math.ceil(count / 2);
  const xlRows = Math.ceil(count / 4);
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Clear interval when component unmounts
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleImageClick = (image: Image): void => {
    if (!randomImages) return;
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setVisible(true);
    const imageIndex = randomImages.findIndex(
      (item) => item.sttid === image.sttid
    );
    setIndex(imageIndex);

    // Start new interval
    intervalRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % randomImages.length);
    }, 1500);
  };

  const handleClose = (): void => {
    setVisible(false);
    // Clear interval when closing
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  if (!randomImages) return null;

  return (
    <>
      <PhotoSlider
        images={randomImages.map((item) => ({
          src: item.url,
          key: item.sttid,
        }))}
        visible={visible}
        onClose={handleClose}
        index={index}
        bannerVisible={false}
        loadingElement={
          <div className="w-full h-full text-6xl text-white">Loading...</div>
        }
      />
      <div
        className={`grid grid-cols-2 grid-rows-${rows} xl:grid-cols-4 xl:grid-rows-${xlRows} gap-4 w-96 xl:w-192 h-fit`}
      >
        {randomImages?.map((image: Image) => (
          <img
            key={image.sttid}
            src={image.url}
            alt={image.sttid}
            className="object-cover w-full h-full p-2"
            loading="lazy"
            width={184}
            height={64}
            onClick={() => handleImageClick(image)}
          />
        ))}
      </div>
    </>
  );
};
