import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueRouter from "vue-router";
import { routes}  from './routes';

// This is everything we need to work with Apollo 2.0.
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import VueApollo from 'vue-apollo';

// Register the VueApollo plugin with Vue.
Vue.use(VueApollo);

// Create a new HttpLink to connect to your GraphQL API.
// According to the Apollo docs, this should be an absolute URI.
const httpLink = new HttpLink({
  uri: `http://localhost:4000/`
});

// I'm creating another variable here just because it makes it easier to add more links in the future.
const link = httpLink;

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




Vue.config.productionTip = false
Vue.use(VueRouter);

const router = new VueRouter({
  routes,
  mode: 'history'
});

new Vue({
  // Inject apolloProvider for components to use.
  provide: apolloProvider.provide(),
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
