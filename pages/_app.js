import Layout from "../components/Layout";
import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import {getDefaultWallets, RainbowKitProvider} from "@rainbow-me/rainbowkit";
import {chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

// Configure the chains to connect to with the Infura api key & initialize wagmiClient:
const alchemyId = process.env.ALCHEMY_ID; 

const { chains, provider } = configureChains(
  [chain.polygon],
  [alchemyProvider({alchemyId}), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "web3rsvp",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true, 
  connectors,
  provider,
});

export default function MyApp({ Component, pageProps }) {
  
  // Wrap application w/ RainbowKitProvider & WagmiConfig
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </RainbowKitProvider>
    </WagmiConfig>  
  );
}
