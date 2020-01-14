<template>
    <v-card outlined >
        <div class="text-center">
            <h1  class="display-1 pa-2">
                Painel de Perguntas
            </h1>
            <v-divider></v-divider>
        </div>

        <v-row dense class="pa-4"   v-if="!perguntaAtual">
            <v-col sm="6">
                <v-alert  type="info">
                    Não há perguntas disponíveis.
                </v-alert>
            </v-col>
            <v-col sm="6">
                <v-btn  @click="setPergunta(primeiraPerguntaNaoRespondida)" x-large block color="success" dark>Iniciar</v-btn>
            </v-col>
        </v-row>

        <v-row dense v-if="perguntaAtual" justify="center">
            <v-col cols="3">
                <v-card class=" grey lighten-3  subtitle-1  text-center" elevation="4">
                    <div class="mb-1 pt-2">
                        <span>Anterior</span>
                    </div>
                    <div class="mb-2">
                        <span> {{ perguntaAnterior }} </span>
                    </div>
                </v-card>
            </v-col>
            <v-col cols="3">
                <v-card class="subtitle-1  text-center" tile elevation="4">
                    <div class="mb-1 pt-2">
                        <span >Atual</span>
                    </div>
                    <div class="text-center">
                        <span> {{ perguntaAtual }} </span>
                    </div>
                </v-card>
            </v-col>
            <v-col cols="3">
                <v-card class="grey lighten-3 subtitle-1 text-center" tile elevation="4">
                    <div class="mb-1 pt-2">
                        <span>Próxima</span>
                    </div>
                    <div>
                        <span> {{ proximaPergunta }} </span>
                    </div>
                </v-card>
            </v-col>
        </v-row>

        <v-divider></v-divider>

        <v-row dense class="pa-4"  v-if="perguntaAtual">
            <v-col cols="4">
                <v-btn  @click="setPergunta(0)" large outlined block color="red" title="Bloquear respostas">
                    <v-icon class="mdi mdi-block-helper hidden-sm-and-up"></v-icon>
                    <span class="hidden-sm-and-down">Bloquear respostas</span>
                </v-btn>
            </v-col>
            <v-col cols="4">
                <v-btn  v-if="perguntaAnterior"  @click="setPergunta(perguntaAnterior)" outlined large block title="Anterior">
                    <v-icon class="mdi mdi-arrow-left-circle-outline hidden-sm-and-up"></v-icon>
                    <span class="hidden-sm-and-down">Anterior</span>
                </v-btn>
                <v-btn  v-if="!perguntaAnterior" disabled outlined large block color="grey" title="Anterior">
                    <v-icon class="mdi mdi-arrow-left-circle-outline hidden-sm-and-up"></v-icon>
                    <span class="hidden-sm-and-down">Anterior</span>
                </v-btn>
            </v-col>
            <v-col cols="4">
                <v-btn  @click="setPergunta(proximaPergunta)" large outlined block title="Próxima">
                    <v-icon class="mdi mdi-arrow-right-circle-outline hidden-sm-and-up"></v-icon>
                    <span class="hidden-sm-and-down">Próxima</span>
                </v-btn>
            </v-col>
        </v-row>

        <v-row class="pa-4" dense v-if="perguntaAtual">
            <v-col cols="12">
                <span class="body-1">Ir para pergunta específica </span>
            </v-col>

            <v-col cols="8" md="2" >
                <v-text-field
                    v-model="perguntaEspecifica"
                    label="Pergunta"
                    type="number"
                    outlined
                ></v-text-field>
            </v-col>
            <v-col cols="4" md="2">
                <v-btn
                        outlined x-large block color="primary" dark
                        v-if="perguntaEspecifica"
                        @click="setPergunta(perguntaEspecifica)"
                >
                    <v-icon class="mdi mdi-send hidden-sm-and-up"></v-icon>
                    <span class="hidden-sm-and-down">Selecionar</span>
                </v-btn>
                <v-btn
                        outlined disabled block x-large
                        v-if="!perguntaEspecifica"
                >
                    <v-icon class="mdi mdi-send hidden-sm-and-up"></v-icon>
                    <span class="hidden-sm-and-down">Selecionar</span>
                </v-btn>
            </v-col>
        </v-row>



    </v-card>
</template>

<script>
    import gql from "graphql-tag";

    export default {
        name: "PainelPerguntas",
        data: () => ({
            perguntaAtual: null,
            perguntaEspecifica: null,
            primeiraPerguntaNaoRespondida: null,
        }),
        methods: {
          setPergunta(pergunta) {
              this.$apollo
                  .mutate({
                      mutation: gql`
                      mutation ($pergunta: Int!) {
                         setPerguntaAtual(pergunta: $pergunta)
                      }
                  `,
                  variables: {pergunta:  parseInt(pergunta)}
                  })
                  .then(() => {
                      this.perguntaEspecifica = null;
                      this.$apollo.queries.getPrimeiraPerguntaNaoRespondida.refetch();
                  })
                  .catch(e => {
                      const msg = e.graphQLErrors[0].message || "Ocorreu um erro. Tente novamente.";
                      this.Helper.exibirMensagem(msg, 'error', 3000);
                  });
          }

        },

        computed: {
            perguntaAnterior() {
                return this.perguntaAtual - 1;
            },
            proximaPergunta() {
                return this.perguntaAtual + 1;
            }
        },

        apollo: {

            getPerguntaAtual: {
                query: gql`
                  query getPerguntaAtual {
                    getPerguntaAtual
                  }
                `,
                result(res) {
                    this.perguntaAtual = res.data.getPerguntaAtual;
                },
                catch() {
                    this.Helper.exibirMensagem("error", 'error', 3000);
                }

            },

            getPrimeiraPerguntaNaoRespondida: {
                query: gql`
                  query getPrimeiraPerguntaNaoRespondida {
                    getPrimeiraPerguntaNaoRespondida
                  }
                `,
                result(res) {
                    this.primeiraPerguntaNaoRespondida = res.data.getPrimeiraPerguntaNaoRespondida;
                },
                catch() {
                    this.Helper.exibirMensagem("error", 'error', 3000);
                }

            },
            $subscribe: {
                novaPerguntaAtual: {
                    query: gql`
                    subscription {
                          novaPerguntaAtual
                    }
                    `,
                    result (data) {
                        this.perguntaAtual = data.data.novaPerguntaAtual;
                    },
                },
            },

        }
    }
</script>

<style scoped>

</style>