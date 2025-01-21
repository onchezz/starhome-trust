import scaffoldConfig from "../../../starhomes.config";
import { contracts } from "./contract";


export function getAllContracts() {
  const contractsData = contracts?.[scaffoldConfig.targetNetworks[0].network];
  return contractsData ? contractsData : {};
}
