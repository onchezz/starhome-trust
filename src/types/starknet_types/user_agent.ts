import { BigNumberish, num, shortString } from "starknet";

export interface StarknetAgent {
  agent_id: string;
  name: string;
  phone: string;
  email: string;
  profile_image: string;
  agent_address: string;
}

export interface RegisterAgentResponse {
  transaction_hash: string;
  status: 'success' | 'pending' | 'error';
}
export class AgentConverter {
    static feltToString(felt: string): string {
        return shortString.decodeShortString(felt);
    }
    static addressToString(address: BigNumberish): string {
        return num.toHex(address);
    }

    static fromStarknetAgent(starknetAgent: any): StarknetAgent {
      if (!starknetAgent) {
        return {
          agent_id: "",
          name: "",
          phone: "",
          email: "",
          profile_image: "",
          agent_address: "",
        };
      }

      return {
        agent_id: this.addressToString(starknetAgent.agent_id),
        name: this.feltToString(starknetAgent.name),
        phone: this.feltToString(starknetAgent.phone),
        email: this.feltToString(starknetAgent.email),
        profile_image: starknetAgent.profile_image,
        agent_address: this.addressToString(starknetAgent.agent_id),
      };
    }
  }