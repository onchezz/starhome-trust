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