import React, { useState } from 'react';
import { useStakingContract } from '../hooks/useStakingContract';
import { useAccount } from '@starknet-react/core';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from './ui/use-toast';

export function StakingInterface() {
  const [amount, setAmount] = useState('');
  const { address } = useAccount();
  const { loading, error, stake, withdraw, getRewards, claimRewards } = useStakingContract();
  const { toast } = useToast();

  const handleStake = async () => {
    try {
      await stake(Number(amount));
      toast({
        title: 'Success',
        description: `Successfully staked ${amount} tokens`,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to stake tokens',
        variant: 'destructive',
      });
    }
  };

  const handleWithdraw = async () => {
    try {
      await withdraw(Number(amount));
      toast({
        title: 'Success',
        description: `Successfully withdrawn ${amount} tokens`,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to withdraw tokens',
        variant: 'destructive',
      });
    }
  };

  const handleGetRewards = async () => {
    if (!address) {
      toast({
        title: 'Error',
        description: 'Please connect your wallet first',
        variant: 'destructive',
      });
      return;
    }

    try {
      const rewards = await getRewards(address);
      toast({
        title: 'Rewards',
        description: `Your current rewards: ${rewards}`,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to get rewards',
        variant: 'destructive',
      });
    }
  };

  const handleClaimRewards = async () => {
    try {
      await claimRewards();
      toast({
        title: 'Success',
        description: 'Successfully claimed rewards',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to claim rewards',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Staking Interface</h2>
      
      <div className="space-y-4">
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="w-full"
        />

        <div className="grid grid-cols-2 gap-2">
          <Button 
            onClick={handleStake} 
            disabled={loading || !amount}
          >
            Stake
          </Button>
          <Button 
            onClick={handleWithdraw} 
            disabled={loading || !amount}
            variant="outline"
          >
            Withdraw
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button 
            onClick={handleGetRewards} 
            disabled={loading}
            variant="secondary"
          >
            Get Rewards
          </Button>
          <Button 
            onClick={handleClaimRewards} 
            disabled={loading}
            variant="secondary"
          >
            Claim Rewards
          </Button>
        </div>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
      </div>
    </div>
  );
}