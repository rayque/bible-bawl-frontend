import store from "./../store";
import moment from "moment";

export const exibirMensagem = (mensagem, color, timeout) => {
  mensagem = mensagem.replace("GraphQL error: ", "");

  const snackbar = { mensagem, color, timeout, ativo: true };
  store.commit("habilitarSnackBar", snackbar);
};

export const setLoadingAtivo = (ativo = true) => {
  store.commit("setLoadingAtivo", ativo)
}

export const validarData = data => {
  if (!verificarTamanhoData(data)) {
    return false;
  }
  moment.locale("pt-BR");
  return moment(data, "DDMMYYYY").isValid();
};

export const verificarTamanhoData = data => !(data.length < 8);
