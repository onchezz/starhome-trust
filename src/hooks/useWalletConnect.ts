import { useConnect } from "@starknet-react/core";
import { useCallback } from "react";
// import { useConnect, type Connector } from "wagmi";

interface UseWalletConnectReturn {
  connectWallet: () => void;
  isConnecting: boolean;
  error: Error | null;
}

export const useWalletConnect = (): UseWalletConnectReturn => {
  const { connect, connectors, isPending, error } = useConnect();

  const connectWallet = useCallback(() => {
    const connector = connectors[0];
    if (connector) {
      connect({ connector });
    }
  }, [connect, connectors]);

  return {
    connectWallet,
    isConnecting: isPending,
    error: error || null,
  };
};
