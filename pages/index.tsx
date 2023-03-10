import Head from "next/head";
import Header from "@/components/Header";
import LotteryEntrance from "@/components/LotteryEntrance";
/* import ManualHeader from "@/components/ManualHeader"; */

export default function Home() {
  return (
    <>
      <Head>
        <title>Smart Contract Lottery</title>
        <meta name="description" content="Fully automated and descentralized Smart Contract Lottery" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <ManualHeader /> */}
      <Header />
      <LotteryEntrance />
    </>
  );
}
