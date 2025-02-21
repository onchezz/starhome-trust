import {
  Account,
  Contract,
  Provider,
  constants,
  hash,
  shortString,
  stark,
  uint256,
} from "starknet";

// Avnu Paymaster contract interface
const AVNU_PAYMASTER_ABI = [
  {
    type: "function",
    name: "request_fee_payment",
    inputs: [
      {
        name: "transaction_hash",
        type: "felt"
      },
      {
        name: "max_fee",
        type: "felt"
      },
      {
        name: "token",
        type: "felt"
      }
    ],
    outputs: [
      {
        name: "success",
        type: "felt"
      }
    ],
    stateMutability: "external"
  }
];

export class AvnuPaymaster {
  private contract: Contract;
  private provider: Provider;

  constructor(
    paymasterAddress: string,
    provider: Provider
  ) {
    this.contract = new Contract(AVNU_PAYMASTER_ABI, paymasterAddress, provider);
    this.provider = provider;
  }

  async subsidizeTransaction(
    account: Account,
    to: string,
    calldata: string[],
    maxFee: string,
    tokenAddress: string
  ) {
    try {
      // 1. Estimate the transaction fee
      const estimatedFee = await account.estimateInvokeFee({
        contractAddress: to,
        entrypoint: "execute",
        calldata: calldata
      });

     
      // 2. Request fee payment from Avnu Paymaster
      const txHash = hash.calculateInvokeTransactionHash(
       {  senderAddress: account.address,
        version: '0x1',
        compiledCalldata: calldata,
        maxFee: estimatedFee.suggestedMaxFee,
        chainId:await  this.provider.getChainId(),
        nonce: await account.getNonce()}
      );

      const paymasterResponse = await this.contract.request_fee_payment(
        txHash,
        estimatedFee.suggestedMaxFee,
        tokenAddress
      );

      if (!paymasterResponse.success) {
        throw new Error("Paymaster rejected the transaction");
      }

      // 3. Execute the transaction with paymaster
      const tx = await account.execute(
        {
          contractAddress: to,
          entrypoint: "execute",
          calldata: calldata
        },
        undefined,
        {
          maxFee: estimatedFee.suggestedMaxFee,
          paymasterData: [this.contract.address, tokenAddress]
        }
      );

      return tx;
    } catch (error) {
      console.error("Error in subsidizing transaction:", error);
      throw error;
    }
  }

  // Helper method to check if paymaster is available for a token
  async isTokenSupported(tokenAddress: string): Promise<boolean> {
    try {
      const supportedTokens = await this.contract.get_supported_tokens();
      return supportedTokens.includes(tokenAddress);
    } catch (error) {
      console.error("Error checking token support:", error);
      return false;
    }
  }
}

// Usage example:
/*
const provider = new Provider({ ... });
const account = new Account(provider, userAddress, userPrivateKey);
const paymaster = new AvnuPaymaster(AVNU_PAYMASTER_ADDRESS, provider);

// Subsidize a transaction
const tx = await paymaster.subsidizeTransaction(
  account,
  contractAddress,
  calldata,
  maxFee,
  tokenAddress
);
*/