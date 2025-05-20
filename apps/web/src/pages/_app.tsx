import "src/styles/globals.css";
import type { AppProps } from "next/app";
import { Layout } from "src/components/layout";
import "@arco-design/web-react/dist/css/arco.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
