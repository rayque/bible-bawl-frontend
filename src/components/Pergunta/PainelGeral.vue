<template>
    <div>
        <v-row justify="center">
            <v-dialog v-model="dialog" fullscreen hide-overlay
                      transition="dialog-bottom-transition">
                <template v-slot:activator="{ on }">
                    <v-btn color="primary" dark v-on="on"
                    outlined tile>
                        Exibir Painel
                    </v-btn>
                </template>
                <v-card>
                    <v-toolbar dark color="primary">
                        <v-toolbar-title>PAINEL GERAL</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn icon dark @click="dialog = false">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </v-toolbar>

                    <v-row class="mb-0">
                        <v-col md="12" class="mb-0">

                            <v-card elevation="5">

                                <v-row no-gutters v-if="!perguntaAtual">
                                    <v-col sm="12" class="pa-12">

                                        <v-alert
                                                class="display-2 "
                                                tile
                                                color="primary"
                                                outlined
                                                border="left"
                                                text
                                                type="info"
                                                prominent
                                        >
                                            Não há perguntas disponíveis
                                        </v-alert>

                                    </v-col>
                                </v-row>

                                <v-row dense v-if="perguntaAtual"
                                       justify="center">
                                    <v-col cols="3">
                                        <v-card class=" grey lighten-3  headline text-center"
                                                elevation="4">
                                            <div class="mb-1 pt-2">
                                                <span>ANTERIOR</span>
                                            </div>
                                            <div class="mb-2">
                                                <span> {{ perguntaAnterior }} </span>
                                            </div>
                                        </v-card>
                                    </v-col>
                                    <v-col cols="3">
                                        <v-card class="headline text-center"
                                                tile elevation="4">
                                            <div class="mb-1 pt-2">
                                                <span>ATUAL</span>
                                            </div>
                                            <div class="text-center">
                                                <div> {{
                                                    perguntaAtual.id }}
                                                </div>
                                                <span title="Status da pergunta atual"
                                                      :class="`${getColorStatus(perguntaAtual.status.nome)}--text body-2  font-weight-medium text-uppercase`">
                                                    {{ perguntaAtual.status.descricao }}
                                                </span>
                                            </div>
                                        </v-card>
                                    </v-col>
                                    <v-col cols="3">
                                        <v-card class="grey lighten-3  headline text-center"
                                                tile elevation="4">
                                            <div class="mb-1 pt-2">
                                                <span>PRÓXIMA</span>
                                            </div>
                                            <div class="">
                                                <span> {{ proximaPergunta }} </span>
                                            </div>
                                        </v-card>
                                    </v-col>
                                </v-row>

                                <v-divider></v-divider>

                            </v-card>
                        </v-col>
                    </v-row>


                    <v-row v-if="perguntaAtual" class="mt-0">


                        <v-col>
                            <v-card elevation="5 ">

                                <v-row>
                                    <v-col
                                            v-for="(categoria, index) in pontuacao"
                                            :key="index"
                                            sm="4"
                                            :class="getColorCategoria(index)"
                                            class="pa-5"
                                    >
                                        <div class="text-center mb-4">
                                            <span class="title">
                                                {{ categoria.descricao }}
                                            </span>
                                        </div>

                                        <v-row v-for="(equipe, index) in categoria.equipes"
                                               :key="index">
                                            <v-col
                                                    :class="`${getColor(participante.pontuacao)}  text-center body-2 font-weight-regular`"
                                                    cols="3"
                                                    v-for="(participante, index) in equipe"
                                                    :key="index"
                                                    style="font-family: 'monospace'">
                                                {{
                                                nomeParticipante(participante.nome)
                                                }}
                                            </v-col>
                                        </v-row>

                                    </v-col>
                                </v-row>

                            </v-card>
                        </v-col>
                    </v-row>


                </v-card>
            </v-dialog>
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
            pontuacao: [],
            dialog: true,
            notifications: false,
            sound: true,
            widgets: false,

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

            getColor(pontos) {
                return pontos === 10 ? 'green' : '';
            },

            getColorCategoria(index) {
                const colors = {
                    0: () => 'yellow lighten-1',
                    1: () => 'orange lighten-2',
                    2: () => 'light-blue lighten-2',
                };
                return (colors[index])();
            },

            nomeParticipante(nome) {
                let name = nome.split(" ", 1).toString().toUpperCase();
                return name.substr(0, 6);
            },

            getColorStatus(nome) {
                const colors = {
                    'n_respondido': 'grey',
                    'respondido': 'green',
                    'cancelado': 'red',
                };
                return colors[nome];
            },
        },

        computed: {
            perguntaAnterior() {
                return parseInt(this.perguntaAtual.id) - 1;
            },
            proximaPergunta() {
                return parseInt(this.perguntaAtual.id) + 1;
            },
        },

        apollo: {
            getPerguntaAtual: {
                query: gql`
                  query getPerguntaAtual {
                    getPerguntaAtual{
                        id
                        pergunta_atual
                        status {
                          id
                          nome
                          descricao
                        }
                    }
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
                    getPrimeiraPerguntaNaoRespondida{
                        id
                        status {
                          id
                          nome
                          descricao
                        }
                    }
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
                    descricao
                    equipes {
                      nome
                      pontuacao
                    }
                    }
                  }
                `,
                variables() {
                    return {pergunta_id: this.perguntaAtual.id}
                },
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
                          novaPerguntaAtual {
                            id
                            status {
                              id
                              nome
                              descricao
                            }
                          }
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
                          descricao
                          equipes {
                            nome
                            pontuacao
                          }
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

