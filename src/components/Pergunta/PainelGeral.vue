<template>
    <div>
        <v-row>
            <v-col>
                <v-card  >
                    <div class="text-center">
                        <h1 class="pa-2 display-1">
                            <b>Painel Geral</b>
                        </h1>
                        <v-divider></v-divider>
                    </div>
                </v-card>
            </v-col>
        </v-row>

        <v-row>
            <v-col>

                <v-card >
                    <div class="text-center">
                        <h1 class="pa-2 display-1">
                            Perguntas
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
                                    prominent
                                    class="display-2"
                            >
                                Não há perguntas disponíveis.
                            </v-alert>

                        </v-col>
                    </v-row>

                    <v-row dense v-if="perguntaAtual" class="pa-4">
                        <v-col cols="4">
                            <v-card class="pa-2 grey lighten-2 grey--text headline text-center" tile>
                                <div class="mb-2">
                                    <span>Anterior</span>
                                </div>
                                <div class="mb-2">
                                    <span> {{ perguntaAnterior }} </span>
                                </div>
                            </v-card>
                        </v-col>
                        <v-col cols="4">
                            <v-card class="pa-2 display-1" tile>
                                <div class="mb-2 text-center">
                                    <span >Atual</span>
                                </div>
                                <div class="mb-2 text-center">
                                    <span> {{ perguntaAtual }} </span>
                                </div>
                            </v-card>
                        </v-col>
                        <v-col cols="4">
                            <v-card class="pa-2 grey lighten-2 grey--text headline text-center" tile>
                                <div class="mb-2 ">
                                    <span>Próxima</span>
                                </div>
                                <div class="mb-2">
                                    <span> {{ proximaPergunta }} </span>
                                </div>
                            </v-card>
                        </v-col>
                    </v-row>

                    <v-divider></v-divider>

                </v-card>
            </v-col>
        </v-row>

        <v-row v-if="perguntaAtual">

            <v-col>

                <v-card >
                    <div class="text-center">
                        <h1 class="pa-2 display-1">
                            Pontuação das Equipes
                        </h1>
                        <v-divider></v-divider>
                    </div>

                    <v-divider></v-divider>

                    <v-row no-gutters  >
                        <v-col md="4" v-for="equipe in pontuacao">
                            <v-row no-gutters justify="center" class="title" :class="getColor(equipe.pontuacao)"  >
                                <v-col  md="8"> {{ equipe.nome }} </v-col>
                                <v-col md="2"> {{ equipe.pontuacao }} </v-col>
                            </v-row>
                        </v-col>
                    </v-row>

                </v-card>
            </v-col>
        </v-row>


    </div>

</template>

<script>
    import gql from "graphql-tag";

    export default {
        name: "PainelPerguntas",
        data: () => ({
            perguntaAtual: false,
            perguntaEspecifica: null,
            primeiraPerguntaNaoRespondida: null,
            pontuacao: []
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
                        variables: {pergunta: parseInt(pergunta)}
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
            getColor(pontuacao) {
                return pontuacao === 50 ? 'orange' : '';
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
            getPontuacaoEquipesByResposta: {
                query: gql`
                  query getPontuacaoEquipesByResposta($pergunta_id: Int!) {
                    getPontuacaoEquipesByResposta(pergunta_id: $pergunta_id) {
                        nome
                        pontuacao
                    }
                  }
                `,
                variables() {
                    return  {pergunta_id: this.perguntaAtual}
                } ,
                skip() {
                    return !this.perguntaAtual
                },
                result(res) {
                    this.pontuacao = res.data.getPontuacaoEquipesByResposta;
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
                    result(data) {
                        this.perguntaAtual = data.data.novaPerguntaAtual;
                    },
                },
                getPontuacaoEquipesByResposta: {
                    query: gql`
                    subscription {
                          getPontuacaoEquipesByResposta{
                            nome
                            pontuacao
                          }
                    }
                    `,
                    result(data) {
                        this.pontuacao = data.data.getPontuacaoEquipesByResposta;
                    },
                },
            },

        }
    }
</script>

