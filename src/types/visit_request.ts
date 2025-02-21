import { shortString, num } from 'starknet';
import { BigNumberish } from 'starknet';

export interface VisitRequest {
  user_id: string;
  property_id: string;
  name: string;
  phone: string;
  email: string;
  agent_id: string;
  message: string;
  visit_date: Date;
  timestamp: Date;
}

export class VisitRequestConverter {
    static feltToString(felt: string): string {
        return felt ? shortString.decodeShortString(felt) : '';
    }

    static addressToString(address: BigNumberish): string {
        return num.toHex(address);
    }

    static fromStarknetVisitRequest(starknetVisitRequest: any): VisitRequest {
        return {
            user_id: this.addressToString(starknetVisitRequest.user_id),
            property_id: this.feltToString(starknetVisitRequest.property_id),
            name: this.feltToString(starknetVisitRequest.name),
            phone: this.feltToString(starknetVisitRequest.phone),
            email: this.feltToString(starknetVisitRequest.email),
            agent_id: this.addressToString(starknetVisitRequest.agent_id),
            message: starknetVisitRequest.message,
            visit_date: new Date(Number(starknetVisitRequest.visit_date) * 1000),
            timestamp: new Date(Number(starknetVisitRequest.timestamp) * 1000)
        };
    }

    static convertToStarknetVisitRequest(visitRequest: Partial<VisitRequest>) {
        return {
            user_id: visitRequest.user_id || "",
            property_id: visitRequest.property_id || "",
            name: visitRequest.name || "",
            phone: visitRequest.phone || "",
            email: visitRequest.email || "",
            agent_id: visitRequest.agent_id || "",
            message: visitRequest.message || "",
            visit_date:  Math.floor(visitRequest.visit_date.getTime() / 1000),
            timestamp: Math.floor(Date.now() / 1000)
        };
    }
}