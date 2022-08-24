import Layout from "../components/Layout";
import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import {darkTheme, getDefaultWallets, RainbowKitProvider} from "@rainbow-me/rainbowkit";
import {chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { ApolloProvider } from "@apollo/client";
import client from "../apollo-client"

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
      <RainbowKitProvider chains={chains} coolMode theme={darkTheme()}>
        <ApolloProvider client={client}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ApolloProvider>
      </RainbowKitProvider>
    </WagmiConfig>  
  );
}
