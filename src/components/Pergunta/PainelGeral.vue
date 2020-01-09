<template>
    <div>



        <v-row justify="center">
            <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
                <template v-slot:activator="{ on }">
                    <v-btn color="primary" dark v-on="on">Exibir Painel</v-btn>
                </template>
                <v-card>
                    <v-toolbar dark color="primary">
                        <v-btn icon dark @click="dialog = false">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                        <v-toolbar-title>Settings</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-toolbar-items>
                            <v-btn dark text @click="dialog = false">Fechar</v-btn>
                        </v-toolbar-items>
                    </v-toolbar>


                    <v-row>
                        <v-col>
                            <v-card >
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
                                    <h1 class="pa-2 headline">
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

                                <v-row dense v-if="perguntaAtual">
                                    <v-col cols="4">
                                        <v-card class="pa-2 grey lighten-2 grey--text subtitle-1 text-center" tile>
                                            <div class="mb-2">
                                                <span>Anterior</span>
                                            </div>
                                            <div class="mb-2">
                                                <span> {{ perguntaAnterior }} </span>
                                            </div>
                                        </v-card>
                                    </v-col>
                                    <v-col cols="4">
                                        <v-card class="pa-2 headline" tile>
                                            <div class="mb-2 text-center">
                                                <span >Atual</span>
                                            </div>
                                            <div class="mb-2 text-center">
                                                <span> {{ perguntaAtual }} </span>
                                            </div>
                                        </v-card>
                                    </v-col>
                                    <v-col cols="4">
                                        <v-card class="pa-2 grey lighten-2 grey--text subtitle-1 text-center" tile>
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
                            <v-card>

                                <v-row class="pa-5" >
                                    <v-col
                                            v-for="(categoria, index) in pontuacao"
                                            sm="4"
                                            :class="getColorCategoria(index)"
                                    >

                                        <div class="text-center mb-4">
                                            <span
                                                class="title"
                                            >
                                                {{ categoria.descricao }}
                                            </span>
                                        </div>

                                        <v-row  v-for="equipe in categoria.equipes">
                                            <v-col
                                                :class="`${getColor(participante.pontuacao)}  text-center body-2 font-weight-black `"
                                                cols="3"
                                                v-for="participante in equipe"
                                            style="font-family: 'monospace'">
                                                {{ nomeParticipante(participante.nome) }}
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
            dialog: false,
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
                    0: () => 'yellow lighten-3',
                    1: () => 'red lighten-3',
                    2: () => 'light-blue lighten-3',
                };
                return (colors[index])();
            },

            nomeParticipante(nome){
                let name =  nome.split(" ", 1).toString().toUpperCase();
                return name.substr(0, 6);
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
                    descricao
                    equipes {
                      nome
                      pontuacao
                    }
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

