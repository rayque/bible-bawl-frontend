<template>
  <v-snackbar right top vertical v-model="ativo" :color="color" :timeout="timeout">
    {{ mensagem }}
    <v-btn dark :color="color" @click="desabilitaSnackbar">Fechar</v-btn>
  </v-snackbar>
</template>

<script>
  export default {
    computed: {
      ativo: {
        // getter
        get: function() {
          return this.$store.state.snackBar.ativo;
        },
        // setter
        set: function() {
          this.$store.commit("setarSBAtivo", false);
        }
      },
      color() {
        return this.$store.state.snackBar.color;
      },
      timeout() {
        return this.$store.state.snackBar.timeout;
      },
      mensagem() {
        return this.$store.state.snackBar.mensagem;
      }
    },
    methods: {
      desabilitaSnackbar() {
        this.$store.commit("setarSBAtivo", false);
      }
    }
  };
</script>
