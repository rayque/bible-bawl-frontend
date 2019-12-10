import Home from './components/HelloWorld'
import Respondedores from './components/admin/Respondedores'
import GerenciarCopa from './components/admin/GerenciarCopa'
import Equipes from './components/respondedor/Equipes'
import Copa from './components/respondedor/Copa'

export const routes = [
  { path: '/', component: Home},
  { path: '/admin/respondedores', component: Respondedores, name: 'respondedores'},
  { path: '/admin/gerenciar-copa', component: GerenciarCopa, name: 'GerenciarCopa'},
  { path: '/respondedor/equipes', component: Equipes, name: 'equipes'},
  { path: '/copa', component: Copa, name: 'copa'},
  { path: '*', redirect: '/'},
];
