// import React from "react";
// import { useTransactionReceipt } from "@starknet-react/core";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import React, { useState } from "react";
import { useTransactionReceipt } from "@starknet-react/core";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Code,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Link } from "react-router-dom";

interface TransactionWidgetProps {
  hash: string;
  onReset?: () => void;
}

export const SimpleTransactionWidget = ({ hash }) => {
  const { data, error, status, isError, isPending, isSuccess, isFetching } =
    useTransactionReceipt({
      hash,
      watch: true,
      enabled: true,
    });

  if (!hash) {
    return (
      <Card className="w-full">
        <CardContent className="py-3">
          <div className="flex items-center justify-center">
            <span className="text-sm text-gray-500">
              Waiting for transaction...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = () => {
    if (isError) return <XCircle className="w-5 h-5 text-red-500" />;
    if (isSuccess) return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (isPending || isFetching)
      return <Clock className="w-5 h-5 text-blue-500 animate-spin" />;
    return <AlertCircle className="w-5 h-5 text-gray-500" />;
  };

  const getStatusColor = () => {
    if (isError) return "text-red-500";
    if (isSuccess) return "text-green-500";
    if (isPending || isFetching) return "text-blue-500";
    return "text-gray-500";
  };

  const handleReset = () => {
    // reset();
    console.log("received data from tx", data.statusReceipt);
    // if (onReset) onReset();
  };

  return (
    <Card className="w-full">
      <CardContent className="py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Transaction</span>
                <span className={`text-sm font-medium ${getStatusColor()}`}>
                  {status}
                </span>
              </div>
              <span className="text-xs font-mono text-gray-500 truncate max-w-[200px]">
              <a href={`https://sepolia.voyager.online/tx/${hash}`} target={'_blank'} rel='noreferrer'>
          {hash}
        </a>
       
               
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-8 w-8 p-0"
          >
            <AlertCircle className="h-4 w-4" />
          </Button>
        </div>
        {error && (
          <div className="mt-2 p-2 bg-red-50 rounded text-sm text-red-600">
            {error.message}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const TransactionWidget: React.FC<TransactionWidgetProps> = ({
  hash,
  onReset,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    data,
    error,
    // reset,
    status,
    isError,
    isPending,
    isSuccess,
    fetchStatus,
    isFetching,
    // isPaused,
    // isIdle,
  } = useTransactionReceipt({
    hash,
    watch: true,
    enabled: true,
  });

  const handleReset = () => {
    // reset();
    if (onReset) onReset();
  };
  if (!hash) {
    return (
      <Card className="w-full">
        <CardContent className="py-3">
          <div className="flex items-center justify-center">
            <span className="text-sm text-gray-500">
              Waiting for transaction...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = () => {
    if (isError) return "text-red-500";
    if (isSuccess) return "text-green-500";
    if (isPending || isFetching) return "text-blue-500";
    return "text-gray-500";
  };

  const getStatusIcon = () => {
    if (isError) return <XCircle className="w-5 h-5 text-red-500" />;
    if (isSuccess) return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (isPending || isFetching)
      return <Clock className="w-5 h-5 text-blue-500 animate-spin" />;
    return <AlertCircle className="w-5 h-5 text-gray-500" />;
  };

  const ReturnValue = ({ label, value, type, description }) => (
    <div className="p-2 border rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between mb-1">
        <div className="flex items-center space-x-2">
          <Code className="w-4 h-4 text-gray-400" />
          <span className="font-medium text-sm">{label}</span>
        </div>
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            typeof value === "boolean"
              ? value
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {String(value)}
        </span>
      </div>
      <div className="text-xs text-gray-500">{type}</div>
    </div>
  );

  // Collapsed view
  if (!isExpanded) {
    return (
      <Card className="w-full">
        <CardContent className="py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getStatusIcon()}
              <div className="flex flex-col">
                <span className="text-sm font-medium">Transaction</span>
                <span className="text-xs font-mono text-gray-500 truncate max-w-[200px]">
                  {hash}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${getStatusColor()}`}>
                {status}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(true)}
                className="p-0 h-8 w-8"
              >
                <ChevronDown className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Expanded view
  return (
    <Card className="w-full">
      <CardContent className="pt-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <span className="text-sm font-medium">Transaction Details</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(false)}
            className="p-0 h-8 w-8"
          >
            <ChevronUp className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-4">
          {/* Transaction Hash */}
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-gray-500">Hash</span>
            <span className="font-mono text-sm break-all">{hash}</span>
          </div>

          <Tabs defaultValue="status" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="status">Status</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            <TabsContent value="status" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-2">
                <ReturnValue
                  label="Status"
                  value={status}
                  type="error | pending | success"
                  description="Transaction status"
                />
                <ReturnValue
                  label="Fetch Status"
                  value={fetchStatus}
                  type="fetching | paused | idle"
                  description="Data fetch status"
                />
              </div>

              {error && (
                <div className="p-2 bg-red-50 rounded-lg text-sm text-red-600">
                  {error.message}
                </div>
              )}

              {data && (
                <div className="p-2 bg-gray-50 rounded-lg">
                  <pre className="text-xs overflow-auto">
                    {JSON.stringify(data, null, 2)}
                  </pre>
                </div>
              )}
            </TabsContent>

            <TabsContent value="details" className="mt-4">
              <div className="grid gap-2">
                <ReturnValue
                  label="isError"
                  value={isError}
                  type="boolean"
                  description="Error state"
                />
                <ReturnValue
                  label="isPending"
                  value={isPending}
                  type="boolean"
                  description="Pending state"
                />
                <ReturnValue
                  label="isSuccess"
                  value={isSuccess}
                  type="boolean"
                  description="Success state"
                />
                <ReturnValue
                  label="isFetching"
                  value={isFetching}
                  type="boolean"
                  description="Fetching state"
                />
                {/* <ReturnValue
                  label="isPaused"
                  value={"isPaused"}
                  type="boolean"
                  description="Paused state"
                />
                <ReturnValue
                  label="isIdle"
                  value={"isIdle"}
                  type="boolean"
                  description="Idle state"
                /> */}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="flex items-center space-x-1"
            >
              <AlertCircle className="w-4 h-4" />
              <span>Reset</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// export default{ TransactionWidget ,SimpleTransactionWidget};

// import React from "react";
// import { useTransactionReceipt } from "@starknet-react/core";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   CheckCircle,
//   XCircle,
//   Clock,
//   AlertCircle,
//   Code,
//   Info,
// } from "lucide-react";

// // Types for props
// interface TransactionModalProps {
//   hash: string;
//   isOpen: boolean;
//   onClose: () => void;
//   onReset?: () => void;
// }

// const TransactionReceiptModal: React.FC<TransactionModalProps> = ({
//   hash,
//   isOpen,
//   onClose,
//   onReset,
// }) => {
//   const {
//     data,
//     error,
//     // reset,
//     status,
//     isError,
//     isPending,
//     isSuccess,
//     fetchStatus,
//     isFetching,
//     // isPaused,
//     // isIdle,
//   } = useTransactionReceipt({
//     hash,
//     watch: true,
//     enabled: Boolean(hash) && isOpen,
//   });

//   const handleReset = () => {
//     // reset();
//     if (onReset) onReset();
//   };

//   const StatusBadge = ({ value, className = "" }) => (
//     <span className={`px-2 py-1 text-xs font-medium rounded-full ${className}`}>
//       {String(value)}
//     </span>
//   );

//   const ReturnValue = ({ label, value, type, description }) => (
//     <div className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
//       <div className="flex items-start justify-between mb-1">
//         <div className="flex items-center space-x-2">
//           <Code className="w-4 h-4 text-gray-400" />
//           <span className="font-medium">{label}</span>
//         </div>
//         <div className="flex items-center space-x-2">
//           {typeof value === "boolean" && (
//             <StatusBadge
//               value={value}
//               className={
//                 value
//                   ? "bg-green-100 text-green-700"
//                   : "bg-gray-100 text-gray-700"
//               }
//             />
//           )}
//           {typeof value === "string" && (
//             <StatusBadge value={value} className="bg-blue-100 text-blue-700" />
//           )}
//         </div>
//       </div>
//       <div className="text-xs text-gray-500 mb-1">Type: {type}</div>
//       <div className="text-sm text-gray-600">{description}</div>
//     </div>
//   );

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-2xl">
//         <DialogHeader>
//           <DialogTitle className="flex items-center space-x-2">
//             <Info className="w-5 h-5" />
//             <span>Transaction Details</span>
//           </DialogTitle>
//         </DialogHeader>

//         <Tabs defaultValue="status" className="w-full">
//           <TabsList className="grid w-full grid-cols-2">
//             <TabsTrigger value="status">Current Status</TabsTrigger>
//             <TabsTrigger value="details">Return Values</TabsTrigger>
//           </TabsList>

//           <TabsContent value="status" className="space-y-4 mt-4">
//             {/* Transaction Hash */}
//             <Card>
//               <CardContent className="pt-6">
//                 <div className="flex flex-col space-y-1">
//                   <span className="text-sm text-gray-500">
//                     Transaction Hash
//                   </span>
//                   <span className="font-mono text-sm break-all">{hash}</span>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Status Information */}
//             <Card>
//               <CardContent className="pt-6 space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <ReturnValue
//                     label="Status"
//                     value={status}
//                     type='"error" | "pending" | "success"'
//                     description="Current mutation status of the transaction"
//                   />
//                   <ReturnValue
//                     label="Fetch Status"
//                     value={fetchStatus}
//                     type='"fetching" | "paused" | "idle"'
//                     description="Current state of data fetching"
//                   />
//                 </div>

//                 {error && (
//                   <div className="p-3 bg-red-50 rounded-lg">
//                     <div className="flex items-center space-x-2 mb-1">
//                       <XCircle className="w-4 h-4 text-red-500" />
//                       <span className="font-medium text-red-700">Error</span>
//                     </div>
//                     <span className="text-sm text-red-600">
//                       {error.message}
//                     </span>
//                   </div>
//                 )}

//                 {data && (
//                   <div className="p-3 bg-green-50 rounded-lg">
//                     <div className="flex items-center space-x-2 mb-1">
//                       <CheckCircle className="w-4 h-4 text-green-500" />
//                       <span className="font-medium text-green-700">
//                         Data Received
//                       </span>
//                     </div>
//                     <pre className="text-xs overflow-auto p-2 bg-white rounded">
//                       {JSON.stringify(data, null, 2)}
//                     </pre>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="details" className="mt-4">
//             <Card>
//               <CardContent className="pt-6 space-y-4">
//                 <div className="grid gap-4">
//                   <ReturnValue
//                     label="data"
//                     value={data ? "Resolved" : "Undefined"}
//                     type="Data | undefined"
//                     description="The resolved data from the transaction receipt"
//                   />
//                   <ReturnValue
//                     label="error"
//                     value={error ? "Error" : "None"}
//                     type="Error | null"
//                     description="Any error thrown by the query"
//                   />
//                   <ReturnValue
//                     label="isError"
//                     value={isError}
//                     type="boolean"
//                     description="Indicates if the query resulted in an error"
//                   />
//                   <ReturnValue
//                     label="isPending"
//                     value={isPending}
//                     type="boolean"
//                     description="Indicates if the query is currently being executed"
//                   />
//                   <ReturnValue
//                     label="isSuccess"
//                     value={isSuccess}
//                     type="boolean"
//                     description="Indicates if the query completed successfully"
//                   />
//                   <ReturnValue
//                     label="isFetching"
//                     value={isFetching}
//                     type="boolean"
//                     description="Indicates if the query is actively fetching data"
//                   />
//                   <ReturnValue
//                     label="isPaused"
//                     value={fetchStatus}
//                     type="boolean"
//                     description="Indicates if the query is paused"
//                   />
//                   <ReturnValue
//                     label="isIdle"
//                     value={fetchStatus}
//                     type="boolean"
//                     description="Indicates if the query is idle"
//                   />
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>

//         <div className="flex justify-end space-x-2">
//           <Button
//             variant="outline"
//             onClick={handleReset}
//             className="flex items-center space-x-2"
//           >
//             <AlertCircle className="w-4 h-4" />
//             <span>Reset Query</span>
//           </Button>
//           <Button variant="outline" onClick={onClose}>
//             Close
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// Usage example:
// function App() {

//   return (
//     <div>
//       {/* Your other components */}

//     </div>
//   );
// }

// export default TransactionReceiptModal;

// import React, { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
// import { useTransactionReceipt } from "@starknet-react/core";

// Mock hook - replace this with your actual Starknet hook
// const useTransactionReceipt = ({ hash, enabled }) => {
//   const [status, setStatus] = useState("pending");
//   const [data, setData] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!enabled || !hash) return;

//     let timeoutId;
//     const simulateTransaction = () => {
//       setStatus("fetching");
//       timeoutId = setTimeout(() => {
//         setStatus("success");
//         setData({
//           block_number: Math.floor(Math.random() * 1000000),
//           status: "ACCEPTED",
//           transaction_hash: hash,
//         });
//       }, 2000);
//     };

//     simulateTransaction();
//     return () => clearTimeout(timeoutId);
//   }, [hash, enabled]);

//   return {
//     data,
//     error,
//     isError: status === "error",
//     isPending: status === "pending",
//     isSuccess: status === "success",
//     isFetching: status === "fetching",
//     status,
//     fetchStatus: status === "fetching" ? "fetching" : "idle",
//   };
// // };
// const useTransactionReceipt = ({ hash, enabled, watch, refetchInterval }) => {
//   const [status, setStatus] = useState("pending");
//   const [data, setData] = useState(null);
//   const [error, setError] = useState(null);
//   const [fetchStatus, setFetchStatus] = useState("idle");

//   useEffect(() => {
//     if (!enabled || !hash) return;

//     let timeoutId;
//     const fetchData = async () => {
//       setFetchStatus("fetching");
//       try {
//         // Replace this with your actual API call
//         const response = await fetch(`your_api_endpoint/${hash}`);
//         const result = await response.json();

//         setData(result);
//         setStatus("success");
//         setFetchStatus("idle");
//       } catch (err) {
//         setError(err);
//         setStatus("error");
//         setFetchStatus("idle");
//       }
//     };

//     fetchData();

//     // Handle refetch interval
//     if (refetchInterval) {
//       const interval =
//         typeof refetchInterval === "function"
//           ? refetchInterval({ state: { status } })
//           : refetchInterval;

//       if (interval !== false) {
//         timeoutId = setInterval(fetchData, interval);
//       }
//     }

//     // Handle watch option
//     if (watch) {
//       // Add your block watching logic here
//     }

//     return () => {
//       if (timeoutId) clearInterval(timeoutId);
//       // Clean up any block watchers if needed
//     };
//   }, [hash, enabled, watch, refetchInterval]);

//   const reset = () => {
//     setStatus("pending");
//     setData(null);
//     setError(null);
//     setFetchStatus("idle");
//   };

//   return {
//     data,
//     error,
//     reset,
//     status,
//     isError: status === "error",
//     isPending: status === "pending",
//     isSuccess: status === "success",
//     fetchStatus,
//     isFetching: fetchStatus === "fetching",
//     isPaused: fetchStatus === "paused",
//     isIdle: fetchStatus === "idle",
//   };
// };
// export const TransactionStatusViewer = ({ hash }) => {
//   const [isVisible, setIsVisible] = useState(false);
// const {
//     data: receipt,
//     error,
//     isError,
//     isPending,
//     isSuccess,
//     isFetching,
//     status,
//     fetchStatus,
//   } = useTransactionReceipt({
//     hash,
//     enabled: Boolean(hash) && isVisible,
//   });
//   // Don't even initialize the hook if there's no hash
//   if (!hash) {
//     return null;
//   }

//   const getStatusIcon = (isActive) => {
//     if (!isActive) return null;
//     if (isError) return <XCircle className="w-5 h-5 text-red-500" />;
//     if (isPending || isFetching)
//       return <Clock className="w-5 h-5 text-blue-500 animate-spin" />;
//     if (isSuccess) return <CheckCircle className="w-5 h-5 text-green-500" />;
//     return <AlertCircle className="w-5 h-5 text-gray-400" />;
//   };

//   // Format hash for display (show first 6 and last 4 characters)
//   const formatHash = (hash) => {
//     if (!hash) return "N/A";
//     if (hash.length <= 10) return hash;
//     return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
//   };

//   return (
//     <div className="inline-flex flex-col">
//       <Button
//         onClick={() => setIsVisible(!isVisible)}
//         variant={isVisible ? "secondary" : "default"}
//         size="sm"
//         className="mb-2"
//       >
//         {isVisible ? "Hide Status" : `View Status: ${formatHash(hash)}`}
//       </Button>

//       {isVisible && (
//         <Card className="w-[300px]">
//           <CardContent className="pt-6">
//             <div className="space-y-4">
//               {/* Transaction Hash */}
//               <div className="flex flex-col gap-1">
//                 <span className="text-xs text-gray-500">Transaction Hash:</span>
//                 <span className="font-mono text-xs break-all">{hash}</span>
//               </div>

//               {/* Status Indicators */}
//               <div className="space-y-2">
//                 {isPending && (
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm text-gray-500">Pending</span>
//                     {getStatusIcon(isPending)}
//                   </div>
//                 )}

//                 {isFetching && (
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm text-gray-500">Fetching</span>
//                     {getStatusIcon(isFetching)}
//                   </div>
//                 )}

//                 {isSuccess && (
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm text-gray-500">Success</span>
//                     {getStatusIcon(isSuccess)}
//                   </div>
//                 )}

//                 {isError && (
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm text-gray-500">Error</span>
//                     {getStatusIcon(isError)}
//                   </div>
//                 )}
//               </div>

//               {/* Additional Details */}
//               {isSuccess && receipt && (
//                 <div className="pt-2 border-t border-gray-100">
//                   <div className="text-sm space-y-1">
//                     <div className="flex justify-between">
//                       <span className="text-gray-500">Block:</span>
//                       <span>{isPending|| "Pending"}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-500">Status:</span>
//                       <span className="text-green-600">{status}</span>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Error Message */}
//               {isError && (
//                 <div className="text-sm text-red-500 break-words">
//                   {error?.message || "Transaction failed"}
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// };

// Example usage with optional hash
// e
// import React, { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";

// Mock hook to simulate transaction receipt behavior
// const useTxTransactionReceipt = ({ hash, enabled }) => {
//   const [status, setStatus] = useState("pending");
//   const [data, setData] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!enabled || !hash) return;

//     const simulateTransaction = () => {
//       useTransactionReceipt
//       // Simulate different states
//       //   setStatus("fetching");
//       //   timeoutId = setTimeout(() => {
//       //     // Randomly simulate success or error
//       //     const isSuccess = Math.random() > 0.3;
//       //     if (isSuccess) {
//       //       setStatus("success");
//       //       setData({
//       //         block_number: Math.floor(Math.random() * 1000000),
//       //         status: "ACCEPTED",
//       //         transaction_hash: hash,
//       //       });
//       //     } else {
//       //       setStatus("error");
//       //       setError(new Error("Transaction failed"));
//       //     }
//       //   }, 2000);
//     };

//     simulateTransaction();

//   }, [hash, enabled]);

//   return {
//     data,
//     error,
//     isError: status === "error",
//     isPending: status === "pending",
//     isSuccess: status === "success",
//     isFetching: status === "fetching",
//     status,
//     fetchStatus: status === "fetching" ? "fetching" : "idle",
//   };
// };

// export const TransactionStatusViewer = ({ hash}) => {
//   const [isVisible, setIsVisible] = useState(false);

//   const {
//     data: receipt,
//     error,
//     isError,
//     isPending,
//     isSuccess,
//     isFetching,
//     status,
//     fetchStatus,
//   } = useTxTransactionReceipt({
//     hash,
//     enabled: Boolean(hash) && isVisible,
//   });

//   const getStatusIcon = (isActive) => {
//     if (!isActive) return null;
//     if (isError) return <XCircle className="w-5 h-5 text-red-500" />;
//     if (isPending || isFetching)
//       return <Clock className="w-5 h-5 text-blue-500 animate-spin" />;
//     if (isSuccess) return <CheckCircle className="w-5 h-5 text-green-500" />;
//     return <AlertCircle className="w-5 h-5 text-gray-400" />;
//   };

//   return (
//     <div className="w-full max-w-sm">
//       <Button
//         onClick={() => setIsVisible(!isVisible)}
//         variant={isVisible ? "secondary" : "default"}
//         className="w-full mb-2"
//       >
//         {isVisible ? "Hide Status" : "Show Status"}
//       </Button>

//       {isVisible && (
//         <Card className="w-full">
//           <CardContent className="pt-6">
//             <div className="space-y-4">
//               {/* Transaction Hash */}
//               <div className="flex items-center justify-between text-sm">
//                 <span className="text-gray-500">Hash:</span>
//                 <span className="font-mono text-xs truncate max-w-[200px]">
//                   {hash || "N/A"}
//                 </span>
//               </div>

//               {/* Status Indicators */}
//               <div className="space-y-2">
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm text-gray-500">Pending</span>
//                   {getStatusIcon(isPending)}
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <span className="text-sm text-gray-500">Fetching</span>
//                   {getStatusIcon(isFetching)}
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <span className="text-sm text-gray-500">Success</span>
//                   {getStatusIcon(isSuccess)}
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <span className="text-sm text-gray-500">Error</span>
//                   {getStatusIcon(isError)}
//                 </div>
//               </div>

//               {/* Additional Details */}
//               {isSuccess && receipt && (
//                 <div className="pt-2 border-t border-gray-100">
//                   <div className="text-sm space-y-1">
//                     <div className="flex justify-between">
//                       <span className="text-gray-500">Block:</span>
//                       <span>{receipt.block_number || "Pending"}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-500">Status:</span>
//                       <span className="text-green-600">{receipt.status}</span>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Error Message */}
//               {isError && (
//                 <div className="text-sm text-red-500 break-words">
//                   {error?.message || "Transaction failed"}
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// };

// Example usage
// const TransactionDemo = (hash) => {
//   // For demo purposes - replace with actual transaction hash
//   const exampleHash =
//     "0x123456789abcdef123456789abcdef123456789abcdef123456789abcdef1234";

//   return (
//     <div className="p-4">

//     </div>
//   );
// };

// export default TransactionDemo;
// import React from "react";
// import { useTransactionReceipt } from "@starknet-react/core";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import {
//   CheckCircle,
//   XCircle,
//   Clock,
//   AlertCircle,
//   RefreshCw,
//   Pause,
// } from "lucide-react";

// export const TransactionReceiptModal = ({ hash, isOpen, onClose }) => {
//   const {
//     data,
//     error,
//     status,
//     isError,
//     isPending,
//     isSuccess,
//     fetchStatus,
//     isFetching,
//   } = useTransactionReceipt({
//     hash,
//     watch: true,
//     enabled: Boolean(hash) && isOpen,
//   });

//   const formatHash = (hash) => {
//     if (!hash) return "N/A";
//     return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
//   };

//   const StatusIndicator = ({ isActive, label, icon: Icon, color }) => (
//     <div
//       className={`flex items-center justify-between p-2 rounded-lg ${
//         isActive ? `bg-${color}-50` : "bg-gray-50"
//       }`}
//     >
//       <span
//         className={`text-sm ${
//           isActive ? `text-${color}-700` : "text-gray-500"
//         }`}
//       >
//         {label}
//       </span>
//       <Icon
//         className={`w-5 h-5 ${
//           isActive ? `text-${color}-500` : "text-gray-400"
//         }`}
//       />
//     </div>
//   );

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-md">
//         <DialogHeader>
//           <DialogTitle>Transaction Receipt</DialogTitle>
//         </DialogHeader>

//         <div className="space-y-4">
//           {/* Transaction Details */}
//           <Card>
//             <CardContent className="pt-6">
//               <div className="space-y-2">
//                 <div className="flex flex-col">
//                   <span className="text-sm text-gray-500">
//                     Transaction Hash
//                   </span>
//                   <span className="font-mono text-sm">{formatHash(hash)}</span>
//                 </div>
//                 {/* {data?.block_number && (
//                   <div className="flex flex-col">
//                     <span className="text-sm text-gray-500">Block Number</span>
//                     <span className="font-mono text-sm">
//                       {data.statusReceipt}
//                     </span>
//                   </div>
//                 )} */}
//               </div>
//             </CardContent>
//           </Card>

//           {/* Status Grid */}
//           <div className="grid grid-cols-2 gap-2">
//             <StatusIndicator
//               isActive={isPending}
//               label="Pending"
//               icon={Clock}
//               color="yellow"
//             />
//             <StatusIndicator
//               isActive={isSuccess}
//               label="Success"
//               icon={CheckCircle}
//               color="green"
//             />
//             <StatusIndicator
//               isActive={isError}
//               label="Error"
//               icon={XCircle}
//               color="red"
//             />
//             <StatusIndicator
//               isActive={isFetching}
//               label="Fetching"
//               icon={RefreshCw}
//               color="blue"
//             />
//             <StatusIndicator
//               isActive={""}
//               label="Paused"
//               icon={Pause}
//               color="orange"
//             />
//             <StatusIndicator
//               isActive={""}
//               label="Idle"
//               icon={AlertCircle}
//               color="gray"
//             />
//           </div>

//           {/* Status and Error Details */}
//           <Card>
//             <CardContent className="pt-6">
//               <div className="space-y-2">
//                 <div className="flex justify-between">
//                   <span className="text-sm text-gray-500">Current Status</span>
//                   <span className="text-sm font-medium">{status}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-sm text-gray-500">Fetch Status</span>
//                   <span className="text-sm font-medium">{fetchStatus}</span>
//                 </div>
//                 {error && (
//                   <div className="mt-2 p-2 bg-red-50 rounded-lg">
//                     <span className="text-sm text-red-600">
//                       {error.message}
//                     </span>
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card>

//           {/* Actions */}
//           <div className="flex justify-end space-x-2">
//             {/* <Button variant="outline" onClick={reset}>
//               Reset
//             </Button> */}
//             <Button variant="outline" onClick={onClose}>
//               Close
//             </Button>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// Example usage
// const TransactionPage = () => {
//   const [isOpen, setIsOpen] = React.useState(false);
//   const exampleHash =
//     "0x123456789abcdef123456789abcdef123456789abcdef123456789abcdef1234";

//   return (
//     <div className="p-4">
//       <Button onClick={() => setIsOpen(true)}>View Transaction</Button>
//       <TransactionReceiptModal
//         hash={exampleHash}
//         isOpen={isOpen}
//         onClose={() => setIsOpen(false)}
//       />
//     </div>
//   );
// };

// export default TransactionPage;
