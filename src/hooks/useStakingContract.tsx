import { useContract } from '@starknet-react/core';
import { useState } from 'react';
import { Contract } from 'starknet';
import stakingAbi from '../data/abi';

export const STAKING_CONTRACT_ADDRESS = '0x06711323c3dae0c666a108be21ded892463c1abe08ed77157ff19fb343de7800';

export function useStakingContract() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { contract } = useContract({
    address: STAKING_CONTRACT_ADDRESS,
    abi: stakingAbi,
  });

  const stake = async (amount: number) => {
    console.log('Staking amount:', amount);
    setLoading(true);
    setError(null);
    try {
      if (!contract) {
        throw new Error('Contract not initialized');
      }
      const response = await contract.stake(amount);
      console.log('Stake response:', response);
      return response;
    } catch (err) {
      console.error('Staking error:', err);
      setError(err instanceof Error ? err.message : 'Failed to stake tokens');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const withdraw = async (amount: number) => {
    console.log('Withdrawing amount:', amount);
    setLoading(true);
    setError(null);
    try {
      if (!contract) {
        throw new Error('Contract not initialized');
      }
      const response = await contract.withdraw(amount);
      console.log('Withdraw response:', response);
      return response;
    } catch (err) {
      console.error('Withdrawal error:', err);
      setError(err instanceof Error ? err.message : 'Failed to withdraw tokens');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getRewards = async (account: string) => {
    console.log('Getting rewards for account:', account);
    setLoading(true);
    setError(null);
    try {
      if (!contract) {
        throw new Error('Contract not initialized');
      }
      const response = await contract.get_rewards(account);
      console.log('Get rewards response:', response);
      return response;
    } catch (err) {
      console.error('Get rewards error:', err);
      setError(err instanceof Error ? err.message : 'Failed to get rewards');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const claimRewards = async () => {
    console.log('Claiming rewards');
    setLoading(true);
    setError(null);
    try {
      if (!contract) {
        throw new Error('Contract not initialized');
      }
      const response = await contract.claim_rewards();
      console.log('Claim rewards response:', response);
      return response;
    } catch (err) {
      console.error('Claim rewards error:', err);
      setError(err instanceof Error ? err.message : 'Failed to claim rewards');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    contract,
    loading,
    error,
    stake,
    withdraw,
    getRewards,
    claimRewards
  };
}