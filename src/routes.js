import Home from './components/HelloWorld'

export const routes = [
  { path: '/', component: Home},
  { path: '*', redirect: '/'},
];
