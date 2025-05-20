export default function Home({ error }: { error?: string }) {
  return (
    <div className="flex flex-col gap-4 mx-auto max-w-7xl w-full p-4 bg-gray-100 ">
      <h1>Setutu API</h1>
    </div>
  );
}

export const getServerSideProps = async () => {
  return {
    props: {},
  };
};
