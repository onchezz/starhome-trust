import { VisitRequest, VisitRequestConverter } from './../../types/visit_request';
import { useStarHomeWriteContract } from "../contract_hooks/useStarHomeWriteContract";
import { Property } from "@/types/property";
import { InvestmentAsset } from "@/types/investment";
import { PropertyConverter } from "@/types/property";

export const usePropertyCreate = () => {
  const { execute, status: contractStatus } = useStarHomeWriteContract();

  const handleListSaleProperty = async (property: Partial<Property>) => {
    try {
      if (!property.agentId){
            throw Error("no address available") 
        }

     const  listProperty  = PropertyConverter.convertToStarknetProperty(property);
     console.log(`listing property: ${listProperty}`)
      const response = await execute("list_property", [listProperty]);
      return { status: response, };
    } catch (error) {
      console.error("Error listing property:", error);
      throw error;
    }
  };

  const handleEditProperty = async (propertyId: string, property: Partial<Property>) => {
    try {
       const  editProperty  = PropertyConverter.convertToStarknetProperty(property);
      const response = await execute("edit_property", [
        propertyId,
        editProperty
      ]);
      return { status: response };
    } catch (error) {
      console.error("Error editing property:", error);
      throw error;
    }
  };

 const sendVisitPropertyRequest = async ( visitRequest: Partial<VisitRequest>) => {
    try {
      const  sendVisitRequest  = VisitRequestConverter.convertToStarknetVisitRequest(visitRequest);
      const response = await execute("send_visit_request", [
        sendVisitRequest
      ]);
      return { status: response };
    } catch (error) {
      console.error("Error sending request property visit:", error);
      throw error;
    }
  };
   const payForProperty = async (property_id:string,amount:number ) => {
    try {
      const response = await execute("pay_property", [property_id,amount]);
      return { status: response };
    } catch (error) {
      console.error("Error sending payments:", error);
      throw error;
    }
  };

  return {
    handleListSaleProperty,
    handleEditProperty,
  sendVisitPropertyRequest,
  payForProperty,
    contractStatus
  };
};