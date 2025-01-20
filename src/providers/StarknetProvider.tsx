import { InjectedConnector } from "starknetkit/injected";
import { ArgentMobileConnector, isInArgentMobileAppBrowser } from "starknetkit/argentMobile";
import { WebWalletConnector } from "starknetkit/webwallet";
import { mainnet, sepolia } from "@starknet-react/chains";
import { StarknetConfig, publicProvider, jsonRpcProvider } from "@starknet-react/core";

export default function StarknetProvider({ children }: { children: React.ReactNode }) {
  const chains = [mainnet, sepolia];

  const connectors = isInArgentMobileAppBrowser() ? [
    ArgentMobileConnector.init({
      options: {
        dappName: "Starhomes",
        projectId: "starhomes-project",
        url: "https://web.argent.xyz"
      },
      inAppBrowserOptions: {},
    })
  ] : [
    new InjectedConnector({ options: { id: "braavos", name: "Braavos" }}),
    new InjectedConnector({ options: { id: "argentX", name: "Argent X" }}),
    new WebWalletConnector({ url: "https://web.argent.xyz" }),
    ArgentMobileConnector.init({
      options: {
        dappName: "Starhomes",
        projectId: "starhomes-project",
        url: "https://web.argent.xyz"
      }
    })
  ];

  return (
    <StarknetConfig
      chains={chains}
      provider={jsonRpcProvider({
        rpc: () => ({ nodeUrl: "https://starknet-sepolia.public.blastapi.io/rpc/v0_7" })
      })}
      connectors={connectors}
    >
      {children}
    </StarknetConfig>
  );
}