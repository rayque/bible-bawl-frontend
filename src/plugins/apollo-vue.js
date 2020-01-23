import Vue from 'vue'

// This is everything we need to work with Apollo 2.0.
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';
import VueApollo from 'vue-apollo';
import { split } from 'apollo-link'
import { getMainDefinition } from 'apollo-utilities'

// Register the VueApollo plugin with Vue.
Vue.use(VueApollo);

const authToken = () => {
    return  localStorage.token ? `Bearer ${localStorage.token}` : ""
};

// Create a new HttpLink to connect to your GraphQL API.
// According to the Apollo docs, this should be an absolute URI.
const httpLink = new HttpLink({
    uri: `http://localhost:4000/`,
    headers: {
        authorization: authToken(),
    }
});

// Create a WebSocket link:
const wsLink = new WebSocketLink({
    uri: `ws://localhost:4000/graphql`,
    options: {
        lazy: true,
        reconnect: true,
        connectionParams: async () => {
            return {
                headers: {
                    authorization: authToken(),
                },
            }
        }
    }
});

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
    // split based on operation type
    ({ query }) => {
        const definition = getMainDefinition(query)
        return definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
    },
    wsLink,
    httpLink
)

// I'm creating another variable here just because it makes it easier to add more links in the future.
// const link = httpLink;

// Create the apollo client
const apolloClient = new ApolloClient({
    // Tells Apollo to use the link chain with the http link we set up.
    link,
    // Handles caching of results and mutations.
    cache: new InMemoryCache(),
    // Useful if you have the Apollo DevTools installed in your browser.
    connectToDevTools: true,
});

const apolloProvider = new VueApollo({
    // Apollo 2.0 allows multiple clients to be enabled at once.
    // Here we select the default (and only) client.
    defaultClient: apolloClient,
});

export  default  apolloProvider