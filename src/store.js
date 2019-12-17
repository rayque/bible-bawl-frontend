import Vue from 'vue';
import Vuex from 'vuex';
import jwt from 'jsonwebtoken'

Vue.use(Vuex);
const getDefaultState = () => {
  return {
    snackBar: {
      ativo: false,
      mensagem: "",
      color: "",
      timeout: 0
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
  getNomeUser: state => state.auth.nome,
  getToken: state => state.auth.token,
};
const mutations = {
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
  setAuth({ commit }, token){
    if(token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
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


export default new Vuex.Store({state, getters, mutations, actions});
