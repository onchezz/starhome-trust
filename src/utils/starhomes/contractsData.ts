import scaffoldConfig from "../../../scaffold.config";
import { contracts } from "./contract";


export function getAllContracts() {
  const contractsData = contracts?.[scaffoldConfig.targetNetworks[0].network];
  return contractsData ? contractsData : {};
}
