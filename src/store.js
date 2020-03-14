import Vue from 'vue';
import Vuex from 'vuex';
import jwt from 'jsonwebtoken'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);
const getDefaultState = () => {
    return {
        snackBar: {
            ativo: false,
            mensagem: '',
            color: '',
            timeout: 0
        },
        loading: {
          ativo: false
        },
        auth: {
            token: '',
            nome: '',
            permissao: '',
            respondedorId: null,
            userId: null,
        }
    }
};

const state = getDefaultState();
const getters = {
    getSnackBar: state => state.snackBar,
    getLoading: state => state.loading,
    getNomeUser: state => state.auth.nome,
    getToken: state => state.auth.token,
    getAuth: state => state.auth,
};
const mutations = {
    setLoadingAtivo(state, ativo) {
        state.loading.ativo = ativo
    },
    habilitarSnackBar(state, dados) {
        if (dados.mensagem !== "") {
            state.snackBar.mensagem = dados.mensagem;
            state.snackBar.color = dados.color;
            state.snackBar.timeout = dados.timeout;
            state.snackBar.ativo = dados.ativo;
        }
    },
    setarSBMensagem(state, mensagem) {
        state.snackBar.mensagem = mensagem;
    },
    setarSBAtivo(state, status) {
        state.snackBar.ativo = status;
    },
    setAuth(state, payload) {
        state.auth = payload
    }
};
const actions = {
    setAuth({commit}, token) {
        if (token) {
            localStorage.setItem('token', token)
        } else {
            localStorage.removeItem('token')
            localStorage.removeItem('vuex')
        }

        let auth = {
            token: '',
            nome: '',
            permissao: 'public',
            respondedorId: null,
            userId: null,
        };

        if (token) {
            const dados = jwt.decode(token);

            auth = {
                token: token,
                nome: dados.nome,
                permissao: dados.permissao,
                respondedorId: dados.respondedorId || null,
                userId: dados.userId || null,
            };
        }

        commit("setAuth", auth);
    }
};


export default new Vuex.Store({
    plugins: [
        createPersistedState({
            storage: {
                getItem: key => localStorage.getItem(key),
                setItem: (key, value) => localStorage.setItem(key, value),
                removeItem: () => ""
            }
        })
    ],
    state,
    getters,
    mutations,
    actions
});
