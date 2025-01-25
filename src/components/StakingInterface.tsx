// import { useState } from "react";
// // import { useStakingWrite } from "@/hooks/contract_interactions/useStakingWrite";
// import { Button } from "./ui/button";
// import { Input } from "./ui/input";
// import { toast } from "sonner";

// export const StakingInterface = () => {
//   const [amount, setAmount] = useState("");
//   const { stake, withdraw, claimRewards, loading } = useStakingWrite();

//   const handleStake = async () => {
//     try {
//       if (!amount) {
//         toast.error("Please enter an amount");
//         return;
//       }
//       const amountBigInt = BigInt(amount);
//       await stake({ args: [amountBigInt] });
//       toast.success("Stake successful!");
//       setAmount("");
//     } catch (error) {
//       console.error("Stake error:", error);
//       toast.error("Failed to stake");
//     }
//   };

//   const handleWithdraw = async () => {
//     try {
//       if (!amount) {
//         toast.error("Please enter an amount");
//         return;
//       }
//       const amountBigInt = BigInt(amount);
//       await withdraw({ args: [amountBigInt] });
//       toast.success("Withdrawal successful!");
//       setAmount("");
//     } catch (error) {
//       console.error("Withdraw error:", error);
//       toast.error("Failed to withdraw");
//     }
//   };

//   const handleClaimRewards = async () => {
//     try {
//       await claimRewards({ args: [] });
//       toast.success("Rewards claimed successfully!");
//     } catch (error) {
//       console.error("Claim rewards error:", error);
//       toast.error("Failed to claim rewards");
//     }
//   };

//   return (
//     <div className="space-y-4">
//       <Input
//         type="number"
//         value={amount}
//         onChange={(e) => setAmount(e.target.value)}
//         placeholder="Enter amount"
//         disabled={loading}
//       />
//       <div className="flex gap-2">
//         <Button onClick={handleStake} disabled={loading}>
//           Stake
//         </Button>
//         <Button onClick={handleWithdraw} disabled={loading}>
//           Withdraw
//         </Button>
//         <Button onClick={handleClaimRewards} disabled={loading}>
//           Claim Rewards
//         </Button>
//       </div>
//     </div>
//   );
// };
