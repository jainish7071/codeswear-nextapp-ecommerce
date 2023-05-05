import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>CodesWear.com - Wear the code</title>
        <meta name="description" content="CodesWear.com - wear the code" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <div className="">
        <img src="/wearthecode.png" width="100%" alt="" />
      </div>
      <Footer />
    </>
  );
}
