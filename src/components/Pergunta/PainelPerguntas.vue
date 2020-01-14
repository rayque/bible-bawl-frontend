<template>
    <v-card outlined >
        <div class="text-center">
            <h1  class="headline pa-2">
                Painel de Perguntas
            </h1>
            <v-divider></v-divider>
        </div>

        <v-row dense class="pa-4" v-if="!perguntaAtual">
            <v-col sm="12">
                <v-alert
                        color="primary"
                        dark
                        type="info"
                        border="left"
                        class="body-1"
                >
                    Não há perguntas disponíveis.
                </v-alert>
            </v-col>
        </v-row>

        <v-row  class="pa-4" v-if="!perguntaAtual">

            <v-col cols="12" md="6">
                <span class="title">Irá iniciar na pergunta:  {{ primeiraPerguntaNaoRespondida }}</span>
            </v-col>

            <v-col cols="12" md="6">
                <span class="title mr-2">Iniciar Copa: </span>
                <v-btn
                        @click="setPergunta(primeiraPerguntaNaoRespondida)"
                          color="success" dark outlined
                >Iniciar</v-btn>
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

        <v-row class="pa-4"  v-if="perguntaAtual">
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
                        color="primary"
                        outlined :disabled="!perguntaEspecifica" block x-large
                        @click="setPergunta(perguntaEspecifica)"
                >
                    <v-icon class="mdi mdi-send hidden-sm-and-up"></v-icon>
                    <span class="hidden-sm-and-down">Selecionar</span>
                </v-btn>
            </v-col>

            <v-col cols="12" md="8">
                <span>Status pergunta</span>
                <v-radio-group v-model="statusSelecionado" row>
                    <v-radio
                        v-for="status in statusPergunta" :key="status.id"
                        :label="status.descricao"
                        :value="status.nome"
                        :color="getColorStatus(status.nome)"
                    ></v-radio>
                </v-radio-group>
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
            statusSelecionado: null,
            statusPergunta: [],
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
          },
            getColorStatus(nome){
              const colors = {
                  'n_respondido': () => 'default',
                  'respondido': () => 'green',
                  'cancelado': () => 'red',
              };
              return (colors[nome])();
              

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

            getStatusPergunta: {
                query: gql`
                  query getStatusPergunta {
                    getStatusPergunta {
                        id
                        nome
                        descricao
                      }
                  }
                `,
                result(res) {
                    this.statusPergunta = res.data.getStatusPergunta;
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