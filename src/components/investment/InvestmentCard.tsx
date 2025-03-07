import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExternalLink, Wallet, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { InvestmentAsset } from "@/types/investment";
import { ImageGallery } from "./ImageGallery";
import { useInvestment } from "@/hooks/useInvestment";
import { Shimmer } from "@/components/ui/shimmer";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useAccount, useTransactionReceipt } from "@starknet-react/core";
import { memo, useCallback, useState } from "react";

interface InvestmentCardProps {
  property: InvestmentAsset;
  expandedCardId: string | null;
  setExpandedCardId: (id: string | null) => void;
  // handleConnectWallet: () => void;
}

const InvestmentCardComponent = ({
  property,
  expandedCardId,
  setExpandedCardId,
}: // handleConnectWallet,
InvestmentCardProps) => {
  const {
    connectWallet: handleConnectWallet,
    isConnecting,
    error: walletError,
  } = useWalletConnect();
  const { address } = useAccount();
  // const [sendingTx, setIsSendingTx] = useState(false);
  const {
    investmentAmount,
    contractStatus: contractStatus,
    setInvestmentAmount,
    handleInvest,
    allowance,
    refreshTokenData,
    transactionHash,
    txData,
    isWaitingApproval,
    isWaitingTransactionExecution,
    // setIsWaitingTransactionExecution,
  } = useInvestment(property.investment_token);

  const { data: transactionStatus, error: txError } = useTransactionReceipt({
    hash: transactionHash,
    watch: true,
    enabled: true,
    retry: 9000,
  });
  const handleInvestClick = useCallback(async () => {
    await handleInvest(property.id);

    console.log("from use data", txData);
  }, [handleInvest, property.id, txData]);

  const handleExpandClick = useCallback(
    async (open: boolean) => {
      if (!address) {
        handleConnectWallet();
        return;
      }
      if (open) {
        setExpandedCardId(property.id);
        await refreshTokenData();
      } else {
        setExpandedCardId(null);
      }
    },
    [
      address,
      handleConnectWallet,
      setExpandedCardId,
      property.id,
      refreshTokenData,
    ]
  );

  const isExpanded = expandedCardId === property.id;

  if (!property) {
    console.error("Property is undefined in InvestmentCard");
    return null;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateProgress = (current: number, total: number) => {
    return (current / total) * 100;
  };

  const progress = calculateProgress(
    property.asset_value - property.available_staking_amount,
    property.asset_value
  );

  const getTransactionStatusMessage = () => {
    if (isWaitingApproval) {
      return "Waiting for approval transaction...";
    }
    if (contractStatus?.isPending) {
      return "Waiting for investment transaction...";
    }
    if (Number(investmentAmount) < property.min_investment_amount) {
      return "Enter Minimum amount ";
    }
    if (transactionStatus?.isSuccess) {
      return "Transaction successful!";
    }
    if (transactionStatus?.isError) {
      return "Transaction failed";
    }
    return null;
  };

  const statusMessage = getTransactionStatusMessage();

  return (
    <Card className="overflow-hidden transform transition-all duration-300 hover:shadow-xl">
      <ImageGallery imagesId={property.images} />
      <CardHeader>
        <CardTitle>{property.name}</CardTitle>
        <p className="text-sm text-gray-500">
          {`${property.location.address}, ${property.location.city}, ${property.location.country}`}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Investment Progress</span>
              <span>
                {formatCurrency(
                  property.asset_value - property.available_staking_amount
                )}{" "}
                of {formatCurrency(property.asset_value)}
              </span>
            </div>
            <Progress value={progress} />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Number of Investors</p>
              <p className="font-semibold">{property.investors}</p>
            </div>
            <div>
              <p className="text-gray-500">Minimum Investment</p>
              <p className="font-semibold">
                {formatCurrency(property.min_investment_amount)}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Expected ROI</p>
              <p className="font-semibold">{property.expected_roi}%</p>
            </div>
            <div>
              <p className="text-gray-500">Property Type</p>
              <p className="font-semibold">{property.investment_type}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Collapsible
              className="flex-1"
              open={isExpanded}
              onOpenChange={handleExpandClick}
            >
              <CollapsibleTrigger asChild>
                <Button className="w-full">
                  {address ? "Invest Now" : "Connect Wallet"}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4 space-y-4">
                {address && (
                  <div className="p-3 bg-secondary rounded-lg">
                    {allowance !== undefined ? (
                      <>
                        <p className="text-sm text-muted-foreground mb-1">
                          Your Current Allowance
                        </p>
                        <p className="font-semibold">
                          {allowance ? `${Number(allowance).toFixed(2)}` : "0"}
                        </p>
                      </>
                    ) : (
                      <Shimmer className="h-16 w-full rounded-lg" />
                    )}
                  </div>
                )}
                <Input
                  type="number"
                  placeholder={`Min. ${formatCurrency(
                    property.min_investment_amount
                  )}`}
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  min={property.min_investment_amount}
                  disabled={isWaitingApproval}
                />
                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={handleInvestClick}
                  disabled={
                    isConnecting ||
                    isWaitingTransactionExecution ||
                    isWaitingApproval ||
                    Number(investmentAmount) < property.min_investment_amount
                  }
                >
                  {contractStatus?.isPending || isWaitingApproval ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isWaitingApproval
                        ? "Waiting for Approval..."
                        : "Waiting for transaction..."}
                    </>
                  ) : (
                    <>
                      <Wallet className="mr-2 h-4 w-4" />
                      {address ? "Invest" : "Connect Wallet"}
                    </>
                  )}
                </Button>
                {statusMessage && (
                  <p
                    className={`text-sm text-center ${
                      transactionStatus?.isSuccess
                        ? "text-green-500"
                        : transactionStatus?.isError
                        ? "text-red-500"
                        : "text-blue-500"
                    }`}
                  >
                    {statusMessage}
                  </p>
                )}
                {transactionHash ? (
                  <SimpleTransactionWidget hash={transactionHash} />
                ) : (
                  <> </>
                )}
              </CollapsibleContent>
            </Collapsible>
            <Link
              to={`/investment/${property.id}`}
              state={{ investment: property }} // Pass the property data through state
            >
              <Button variant="outline">
                <ExternalLink className="mr-2 h-4 w-4" />
                More Details
              </Button>
            </Link>

            {/* <Link to={`/investment/${property.id}`}>
              <Button variant="outline">
                <ExternalLink className="mr-2 h-4 w-4" />
                More Details
              </Button>
            </Link> */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const InvestmentCard = memo(InvestmentCardComponent);
InvestmentCard.displayName = "InvestmentCard";

import { useLocation, Navigate } from "react-router-dom";
import InvestmentDetails from "@/pages/InvestmentDetails";
import { SimpleTransactionWidget } from "../txmodal";
import { useWalletConnect } from "@/hooks/useWalletConnect";
import { transaction } from "starknet";
// import { InvestmentDetails } from "./InvestmentDetails";

const InvestmentDetailsPage = () => {
  const location = useLocation();
  const investment = location.state?.investment;

  if (!investment) {
    return <Navigate to="/" replace />; // Redirect if no investment data
  }

  return <InvestmentDetails investment={investment} />;
};

export default InvestmentDetailsPage;
