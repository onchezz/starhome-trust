// import scaffoldConfig from "../../../starhomes.config";
import starhomesConfig from "starhomes.config";
import { contracts } from "./contract";


export function getAllContracts() {
  const contractsData = contracts?.[starhomesConfig.targetNetworks[0].network];
  return contractsData ? contractsData : {};
}
