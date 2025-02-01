import { BigNumberish, num, shortString } from "starknet";

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  profile_image: string;
  is_verified: boolean,
  is_authorized: boolean,
  is_agent: boolean,
  is_investor: boolean,
  timestamp: number,

}

export interface RegisterAgentResponse {
  transaction_hash: string;
  status: 'success' | 'pending' | 'error';
}
export class UserConverter {
    static feltToString(felt: string): string {
        return shortString.decodeShortString(felt);
    }
    static addressToString(address: BigNumberish): string {
        return num.toHex(address);
    }

    static fromStarknetUser(starknetAgent: any): User {
      if (!starknetAgent) {
        return {
          id: "",
          name: "",
          phone: "",
          email: "",
          profile_image: "",
          is_verified: false,
          is_authorized: false,
          is_agent: false,
          is_investor: false,
          timestamp: 0,
        };
      }

      return {
        id: this.addressToString(starknetAgent.id),
        name: this.feltToString(starknetAgent.name),
        phone: this.feltToString(starknetAgent.phone),
        email: this.feltToString(starknetAgent.email),
        profile_image: starknetAgent.profile_image,
        is_verified: starknetAgent.is_verified,
        is_authorized: starknetAgent.is_authorized,
        is_agent: starknetAgent.is_agent,
        is_investor: starknetAgent.is_investor,
        timestamp: Number(starknetAgent.timestamp),
      };
    }

     static toStarknetUser(starknetAgent: any): User {
      if (!starknetAgent) {
        return {
          id: "",
          name: "",
          phone: "",
          email: "",
          profile_image: "",
          is_verified: true,
          is_authorized: false,
          is_agent: false,
          is_investor: false,
          timestamp: Math.floor(Date.now() / 1000),
        };
      }

      return {
        id: this.addressToString(starknetAgent.agent_id),
        name: this.feltToString(starknetAgent.name),
        phone: this.feltToString(starknetAgent.phone),
        email: this.feltToString(starknetAgent.email),
        profile_image: starknetAgent.profile_image,
        is_verified: starknetAgent.is_verified,
        is_authorized: starknetAgent.is_authorized,
        is_agent: starknetAgent.is_agent,
        is_investor: starknetAgent.is_investor,
        timestamp:Math.floor(Date.now() / 1000),
      };
    }
  }