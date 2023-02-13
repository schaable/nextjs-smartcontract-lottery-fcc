import React, { useState, useEffect } from "react";
import { useWeb3Contract } from "react-moralis";
import abi from "../constants/abi.json";
import contractAddresses from "../constants/contractAddresses.json";
import { useMoralis } from "react-moralis";
import { BigNumber, ethers, ContractTransaction } from "ethers";
import { useNotification } from "web3uikit";
import { Bell } from "@web3uikit/icons";

const LotteryEntrance = () => {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = `${parseInt(chainIdHex!)}` as keyof typeof contractAddresses;
  const contractAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : undefined;
  const [entranceFee, setEntranceFee] = useState("0");
  const [numberOfPlayers, setNumberOfPlayers] = useState("0");
  const [recentWinner, setRecentWinner] = useState("0");
  const dispatch = useNotification();

  const {
    runContractFunction: enterRaffle,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi,
    contractAddress,
    functionName: "enterRaffle",
    params: {},
    msgValue: entranceFee,
  });

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi,
    contractAddress,
    functionName: "getEntranceFee",
    params: {},
    msgValue: "",
  });

  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi,
    contractAddress,
    functionName: "getNumberOfPlayers",
    params: {},
    msgValue: "",
  });

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi,
    contractAddress,
    functionName: "getRecentWinner",
    params: {},
    msgValue: "",
  });

  const updateUI = async () => {
    const entranceFee = ((await getEntranceFee()) as BigNumber).toString();
    const numberOfPlayers = ((await getNumberOfPlayers()) as BigNumber).toString();
    const recentWinner = ((await getRecentWinner()) as BigNumber).toString();
    setEntranceFee(entranceFee);
    setNumberOfPlayers(numberOfPlayers);
    setRecentWinner(recentWinner);
  };

  useEffect(() => {
    if (isWeb3Enabled && contractAddress) {
      updateUI();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWeb3Enabled, contractAddress]);

  const handleSuccess = async (tx: ContractTransaction) => {
    await tx.wait(1);
    handleNotification(tx);
    updateUI();
  };

  const handleNotification = (tx: ContractTransaction) => {
    dispatch({
      type: "info",
      message: "Transaction Complete!",
      title: "Tx Notification",
      position: "topR",
      icon: <Bell />,
    });
  };

  return contractAddress ? (
    <div className="p-5">
      <div className="flex items-center ml-auto">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-500"
          onClick={async () =>
            await enterRaffle({
              onSuccess: (tx) => handleSuccess(tx as ContractTransaction),
              onError: (error) => console.log(error),
            })
          }
          disabled={isLoading || isFetching}
        >
          Enter raffle
        </button>
        <div
          className={isLoading || isFetching ? "animate-spin spinner-border h-6 w-6 ml-3 border-b-2 rounded-full" : ""}
        ></div>
      </div>
      <div>Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH</div>
      <div>Number of players: {numberOfPlayers}</div>
      <div>Recent winner: {recentWinner}</div>
    </div>
  ) : (
    <div>No raffle address detected</div>
  );
};

export default LotteryEntrance;
