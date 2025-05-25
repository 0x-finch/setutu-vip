import { pgQueryImages } from "src/libs/pg-client";
import { PhotoCarousel } from "../photo-carousel";

export const PhotoFetch = async () => {
  const images = await pgQueryImages(20);
  return <PhotoCarousel randomImages={images} />;
};
