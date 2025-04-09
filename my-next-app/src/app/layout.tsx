import "./globals.css";
import { Toaster } from "sonner";
import {
  DynamicContextProvider,
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { DYNAMIC_ENV_ID } from "@/constants/constant";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <DynamicContextProvider
          settings={{
            environmentId: DYNAMIC_ENV_ID,
            walletConnectors: [EthereumWalletConnectors],
          }}
        >
          {children}
          <Toaster richColors position="top-right" />
        </DynamicContextProvider>
      </body>
    </html>
  );
}
