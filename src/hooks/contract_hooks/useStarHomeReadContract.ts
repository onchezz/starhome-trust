/* eslint-disable @typescript-eslint/no-explicit-any */
import { Abi, useReadContract } from "@starknet-react/core";
import { BlockNumber } from "starknet";

import {
  AbiFunctionOutputs,
  ContractAbi,
  ContractName,
  ExtractAbiFunctionNamesScaffold,
  UseScaffoldReadConfig,
} from "@/utils/starhomes/contract";
import { useDeployedContractInfo } from "./useDeployedContractInfo";

export const useStarHomeReadContract = <
  TAbi extends Abi,
  TContractName extends ContractName,
  TFunctionName extends ExtractAbiFunctionNamesScaffold<
    ContractAbi<TContractName>,
    "view"
  >,
>({
  contractName,
  functionName,
  args,
  ...readConfig
}: UseScaffoldReadConfig<TAbi, TContractName, TFunctionName>) => {
  const { data: deployedContract } = useDeployedContractInfo(contractName);

  return useReadContract({
    functionName,
    address: deployedContract?.address,
    abi: deployedContract?.abi,
    watch: true,
    args: args || [],
    enabled:
      args && (!Array.isArray(args) || !args.some((arg) => arg === undefined)),
    blockIdentifier: "pending" as BlockNumber,
    ...(readConfig as any),
  }) as Omit<ReturnType<typeof useReadContract>, "data"> & {
    data: AbiFunctionOutputs<ContractAbi, TFunctionName> | undefined;
  };
};
