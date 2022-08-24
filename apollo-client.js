import { ApolloClient, InMemoryCache } from "@apollo/client"

const client = new ApolloClient({
    uri: "https://api.thegraph.com/subgraphs/name/niemacodes/web3-rsvp-subgraph",
    cache: new InMemoryCache(),
});

export default client; 
