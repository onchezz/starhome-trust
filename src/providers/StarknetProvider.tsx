import { InjectedConnector } from "starknetkit/injected";
import {
  ArgentMobileConnector,
  isInArgentMobileAppBrowser,
} from "starknetkit/argentMobile";
import { WebWalletConnector } from "starknetkit/webwallet";
import { mainnet, sepolia } from "@starknet-react/chains";
import { StarknetConfig, publicProvider } from "@starknet-react/core";
// import { defaultProvider } from "starknet";
// import { RpcProvider } from "starknet";
// import { rpcProvideUr } from "@/utils/constants";

// import { Chain } from "@starknet-react/chains";

// function rpc(chain: Chain) {
//   return {
//     nodeUrl: `${rpcProvideUr}`,
//   };
// }

// const provider = jsonRpcProvider({ rpc });
export default function StarknetProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // const chains = [mainnet, sepolia, provider];
  const chains = [sepolia];
  const connectors = isInArgentMobileAppBrowser()
    ? [
        ArgentMobileConnector.init({
          options: {
            dappName: "Starhomes",
            projectId: "starhomes-project",
            url: "https://web.argent.xyz",
          },
          inAppBrowserOptions: {},
        }),
      ]
    : [
        new InjectedConnector({ options: { id: "braavos", name: "Braavos" } }),
        new InjectedConnector({ options: { id: "argentX", name: "Argent X" } }),
        new WebWalletConnector({ url: "https://web.argent.xyz" }),
        ArgentMobileConnector.init({
          options: {
            dappName: "Starhomes",
            projectId: "starhomes-project",
            url: "https://web.argent.xyz",
          },
        }),
      ];

  return (
    <StarknetConfig
      chains={chains}
      provider={publicProvider()}
      connectors={connectors}
      autoConnect={true}
    >
      {children}
    </StarknetConfig>
  );
}
