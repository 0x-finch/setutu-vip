import { pgQueryImages } from "src/lib/pg-client";
import { Image } from "src/types";

export default function Home({ images }: { images: Image[] }) {
  return (
    <div className="flex flex-col items-center gap-4 mx-auto max-w-7xl w-full p-4 bg-gray-100 min-h-screen">
      <h1>Setutu</h1>
      <div className="grid grid-cols-3 grid-rows-3 gap-4 w-96 h-96">
        {images.slice(0, 9).map((image: Image, idx) => (
          <img
            key={idx}
            src={image.url}
            alt={image.sttid}
            className="object-cover w-full h-full p-2"
            loading="lazy"
          />
        ))}
      </div>
      <button
        className="bg-blue-500 text-white p-2 rounded-md cursor-pointer"
        onClick={() => {
          window.location.reload();
        }}
      >
        换一批
      </button>
    </div>
  );
}

export const getServerSideProps = async () => {
  const randomImages = await pgQueryImages();
  return {
    props: {
      images: randomImages,
    },
  };
};
