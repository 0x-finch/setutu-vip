/* eslint-disable @next/next/no-img-element */
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

  const handleDownload = async (image: Image): Promise<void> => {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `setutu-${image.sttid}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download image:", error);
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
          <div key={image.sttid} className="relative group">
            <img
              src={image.url}
              alt={image.sttid}
              className="object-cover w-full h-full p-2 cursor-pointer"
              loading="lazy"
              width={184}
              height={64}
              onClick={() => handleImageClick(image)}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownload(image);
              }}
              className="cursor-pointer absolute bottom-4 right-4 bg-black/90 text-white p-2 rounded-full opacity-100 transition-opacity duration-200"
              title="Download image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </>
  );
};
