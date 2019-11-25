import store from "./../store";
import moment from "moment";

export const exibirMensagem = (mensagem, color, timeout) => {
  const snackbar = { mensagem, color, timeout, ativo: true };
  store.commit("habilitarSnackBar", snackbar);
};



export const validarData = data => {
  if (!verificarTamanhoData(data)) {
    return false;
  }
  moment.locale("pt-BR");
  return moment(data, "DDMMYYYY").isValid();
};

export const verificarTamanhoData = data => !(data.length < 8);
