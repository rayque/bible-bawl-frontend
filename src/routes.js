import VueRouter from "vue-router";

import Home from './components/HelloWorld'
import Auxiliares from './components/admin/Auxiliares'
import GerenciarCopa from './components/admin/GerenciarCopa'
import Resultados from './components/admin/Resultados'
import Equipes from './components/auxiliar/Equipes'
import Copa from './components/auxiliar/Copa'
import PainelGeral from './components/Pergunta/PainelGeral'
import Login from './components/login/Login'

import PageNotFound from './components/views/PageNotFound'

import Vue from "vue";

const routes = [
    {
        path: '/login',
        component: Login,
        name: 'login',
        meta: {
            rule: 'isPublic'
        }
    },
    {
        path: '/',
        component: Home,
        name: 'home',
        meta: {
            rule: 'isLogged'
        }
    },
    {
        path: '/auxiliares',
        component: Auxiliares,
        name: 'auxiliares',
        meta: {
            rule: 'isAdmin'
        }
    },
    {
        path: '/gerenciar-copa',
        component: GerenciarCopa,
        name: 'GerenciarCopa',
        meta: {
            rule: 'isAdmin'
        }
    },
    {
        path: '/resultados',
        component: Resultados,
        name: 'resultados',
        meta: {
            rule: 'isAdmin'
        }
    },
    {
        path: '/painel',
        component: PainelGeral,
        name: 'painel',
        meta: {
            rule: 'isLogged'
        }
    },
    {
        path: '/equipes',
        component: Equipes,
        name: 'equipes',
        meta: {
            rule: 'isLogged'
        }
    },
    {
        path: '/copa',
        component: Copa,
        name: 'copa',
        meta: {
            rule: 'isLogged'
        }
    },
    {
        path: '*',
        name: 'notfound',
        component: PageNotFound,
        meta: {
            rule: '*'
        }
    }
];

Vue.use(VueRouter);

export default new VueRouter({
    routes,
    mode: 'history'
});
