import { useGlobalState } from "@/services/store/store";
import { ChainWithAttributes } from "@/utils/starhomes";
import { useAccount } from "@starknet-react/core";
import { useEffect } from "react";
import starhomesConfig from "starhomes.config";



/**
 * Retrieves the connected wallet's network from scaffold.config or defaults to the 0th network in the list if the wallet is not connected.
 */
export function useTargetNetwork(): { targetNetwork: ChainWithAttributes } {
  const { chainId } = useAccount();
  const targetNetwork = useGlobalState(({ targetNetwork }) => targetNetwork);
  const setTargetNetwork = useGlobalState(
    ({ setTargetNetwork }) => setTargetNetwork,
  );

  useEffect(() => {
    const newSelectedNetwork = starhomesConfig.targetNetworks.find(
      (targetNetwork) => targetNetwork.id === chainId,
    );
    if (newSelectedNetwork && newSelectedNetwork.id !== targetNetwork.id) {
      setTargetNetwork(newSelectedNetwork);
    }
  }, [chainId, setTargetNetwork, targetNetwork.id]);

  return {
    targetNetwork: {
      ...targetNetwork,
      //   ...NETWORKS_EXTRA_DATA[targetNetwork.id],
    },
  };
}
