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
      Hey this is codeSwear
      <div className="mx-4">hey this is me</div>
      <div className="mx-4 bg-slate-500">hey this is me</div>
    </>
  );
}
