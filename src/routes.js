import Home from './components/HelloWorld'
import Respondedores from './components/admin/Respondedores'

export const routes = [
  { path: '/', component: Home},
  { path: '/admin/respondedores', component: Respondedores, name: 'respondedores'},
  { path: '*', redirect: '/'},
];
