import * as React from "react";
import { useMoralis } from "react-moralis";
import { useEffect } from "react";

type Props = {};

const ManualHeader = (props: Props) => {
  const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading } = useMoralis();

  useEffect(() => {
    if (!isWeb3Enabled && window && window.localStorage.getItem("connected")) {
      enableWeb3();
    }
  }, [isWeb3Enabled, enableWeb3]);

  useEffect(() => {
    Moralis.onAccountChanged((account) => {
      if (account === null) {
        window.localStorage.removeItem("connected");
        deactivateWeb3();
      }
    });
  }, [Moralis, deactivateWeb3]);

  const handleClick = async () => {
    await enableWeb3();
    window.localStorage.setItem("connected", "injected");
  };

  return (
    <div>
      {account ? (
        <div>
          Connected to {account.slice(0, 6)}...{account.slice(account.length - 4)}
        </div>
      ) : (
        <button onClick={handleClick} disabled={isWeb3EnableLoading}>
          Connect
        </button>
      )}
    </div>
  );
};

export default ManualHeader;
