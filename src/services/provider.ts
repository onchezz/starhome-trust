
import {
  jsonRpcProvider,
  publicProvider,
  starknetChainId,
} from "@starknet-react/core";
import * as chains from "@starknet-react/chains";
import scaffoldConfig from "starhomes.config";

const containsDevnet = (networks: readonly chains.Chain[]) => {
  return (
    networks.filter((it) => it.network == chains.devnet.network).length > 0
  );
};

const provider =
  scaffoldConfig.rpcProviderUrl == "" ||
  containsDevnet(scaffoldConfig.targetNetworks)
    ? publicProvider()
    : jsonRpcProvider({
        rpc: () => ({
          nodeUrl: scaffoldConfig.rpcProviderUrl,
          chainId: starknetChainId(scaffoldConfig.targetNetworks[0].id),
        }),
      });

export default provider;
