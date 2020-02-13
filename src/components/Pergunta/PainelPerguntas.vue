<template>
    <v-card outlined>
        <div class="text-center">
            <h1 class="headline pa-2">
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

        <v-row class="pa-4" v-if="!perguntaAtual">

            <v-col cols="12" md="6">
                <span class="title">Irá iniciar na pergunta:  {{ primeiraPerguntaNaoRespondidaId }}</span>
            </v-col>

            <v-col cols="12" md="6">
                <span class="title mr-2">Iniciar Copa: </span>
                <v-btn
                        @click="setPergunta(primeiraPerguntaNaoRespondidaId)"
                        color="success" dark tile outlined
                >
                    Iniciar
                </v-btn>
            </v-col>
        </v-row>

        <v-row  v-if="perguntaAtual" justify="center">

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

            <v-col cols="4">
                <v-card class="text-center" tile elevation="4">
                    <div class="subtitle-1  mb-1 pt-2">
                        <span>Atual</span>
                    </div>
                    <div class="text-center">
                        <div class="subtitle-1 "> {{ perguntaAtual.id }}</div>
                        <span title="Status da pergunta atual"
                              :class="`${getColorStatus(perguntaAtual.status.nome)}--text body-2  font-weight-medium text-uppercase`">
                            {{ perguntaAtual.status.descricao }}
                        </span>
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

        <v-row  class="pa-4" v-if="perguntaAtual">

            <v-col cols="12" md="9">

                <v-row>
                    <v-col cols="12 text-center ">
                        <span class="body-1">Mudar status da pergunta atual</span>
                    </v-col>
                </v-row>

                <v-row >

                    <v-col cols="4" v-for="status in statusPergunta" :key="status.id">

                        <v-btn
                                @click="setStatusPergunta(perguntaAtual.id, status.nome)"
                                large block
                                tile outlined
                                :color="getColorStatus(status.nome)"
                        >
                            <v-icon :class="getIcon(status.nome)"></v-icon>
                            <span class="hidden-sm-and-down">{{ status.descricao }}</span>
                        </v-btn>
                    </v-col>

                </v-row>

            </v-col>

            <v-col cols="12" md="3">

                <v-row >
                    <v-col cols="12" class="text-center" >
                        <span class="body-1">Ir para pergunta específica </span>
                    </v-col>
                </v-row>

                <v-row>

                    <v-col cols="7" md="7">
                        <v-text-field
                                v-model="perguntaEspecifica"
                                label="Pergunta"
                                type="number"
                        ></v-text-field>
                    </v-col>

                    <v-col cols="5" md="5">
                        <v-btn
                                color="primary"
                                tile outlined :disabled="!perguntaEspecifica" block large
                                @click="setPergunta(perguntaEspecifica)"
                                title="ir para pergunta específica"
                        >
<!--                            <v-icon class="mdi mdi-send hidden-md-and-up"></v-icon>-->
                            <v-icon class="mdi mdi-send"></v-icon>
<!--                            <span class="hidden-sm-and-down">Selecionar</span>-->
                        </v-btn>
                    </v-col>

                </v-row>


            </v-col>

        </v-row>


        <v-row >
            <v-col cols="12" class="text-center" >
                <span class="body-1"> Mudar pergunta atual </span>
            </v-col>
        </v-row>

        <v-row dense class="pa-4" v-if="perguntaAtual">


            <v-col cols="3">
                <v-btn @click="setPergunta(0)" large tile outlined block color="red" title="Bloquear respostas">
                    <v-icon class="mdi mdi-block-helper hidden-md-and-up"></v-icon>
                    <span class="hidden-sm-and-down">Bloquear respostas</span>
                </v-btn>
            </v-col>

            <v-col cols="3">
                <v-btn v-if="perguntaAnterior" @click="setPergunta(perguntaAnterior)"  tile outlined large block
                       color="primary"
                       title="Anterior">
                    <v-icon class="mdi mdi-arrow-left-circle-outline hidden-md-and-up"></v-icon>
                    <span class="hidden-sm-and-down">Anterior</span>
                </v-btn>
                <v-btn v-if="!perguntaAnterior" disabled tile outlined large block color="grey" title="Anterior">
                    <v-icon class="mdi mdi-arrow-left-circle-outline hidden-md-and-up"></v-icon>
                    <span class="hidden-sm-and-down">Anterior</span>
                </v-btn>
            </v-col>
            <v-col cols="3">
                <v-btn @click="setPergunta(proximaPergunta)" large tile outlined block
                       title="Próxima"
                       color="primary">
                    <v-icon class="mdi mdi-arrow-right-circle-outline hidden-md-and-up"></v-icon>
                    <span class="hidden-sm-and-down">Próxima</span>
                </v-btn>
            </v-col>
            <v-col cols="3">
                <v-btn @click="setPergunta(primeiraPerguntaNaoRespondidaId)"
                       large tile outlined block  title="Primeira pergunta que não foi respondida"
                       :disabled="showBtnPerguntaNaoRespondida"
                >
                    <span class="mdi mdi-chevron-triple-right hidden-md-and-up"> {{ primeiraPerguntaNaoRespondidaId }}  </span>
                    <span class="hidden-sm-and-down">1ª não respondida: {{ primeiraPerguntaNaoRespondidaId }}</span>
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
            primeiraPerguntaNaoRespondidaId: null,
            statusSelecionado: null,
            statusPergunta: [],
        }),
        
        methods: {
            setPergunta(pergunta) {
                this.Helper.setLoadingAtivo();
                
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
                        this.Helper.setLoadingAtivo(false);
                    })
                    .catch(e => {
                        this.Helper.setLoadingAtivo(false);
                        const msg = e.graphQLErrors[0].message || "Ocorreu um erro. Tente novamente.";
                        this.Helper.exibirMensagem(msg, 'error', 3000);
                    });
            },
            setStatusPergunta(pergunta, status) {
                this.Helper.setLoadingAtivo();
                this.$apollo
                    .mutate({
                        mutation: gql`
                      mutation ($pergunta: Int!, $status: String!) {
                         setStatusPergunta(pergunta: $pergunta, status: $status)
                      }
                  `,
                        variables: {
                            pergunta: parseInt(pergunta),
                            status
                        }
                    })
                    .then(() => {
                        this.$apollo.queries.getPrimeiraPerguntaNaoRespondida.refetch();
                        this.Helper.setLoadingAtivo(false);
                    })
                    .catch(e => {
                        this.Helper.setLoadingAtivo(false);
                        const msg = e.graphQLErrors[0].message || "Ocorreu um erro. Tente novamente.";
                        this.Helper.exibirMensagem(msg, 'error', 3000);
                    });
            },
            getColorStatus(nome) {
                const colors = {
                    'n_respondido': 'grey',
                    'respondido': 'green',
                    'cancelado': 'red',
                };
                return colors[nome];
            },
            getIcon(status) {
                const colors = {
                    'n_respondido': 'mdi mdi-checkbox-blank-circle-outline  hidden-md-and-up',
                    'respondido': 'mdi mdi-check-circle-outline hidden-md-and-up',
                    'cancelado': 'mdi mdi-close-circle-outline hidden-md-and-up',
                };
                return colors[status];
            }

        },

        // watch: {
        //     perguntaAtual() {
        //         this.statusSelecionado = this.perguntaAtual.status.nome;
        //     }
        // },

        computed: {
            perguntaAnterior() {
                return parseInt(this.perguntaAtual.id) - 1;
            },
            proximaPergunta() {
                return parseInt(this.perguntaAtual.id) + 1;
            },
            // statusAtual() {
            //     const status = this.statusPergunta.filter(s => {
            //         return s.nome === this.statusSelecionado;
            //     });
            //     return status[0] || [];
            // },
            showBtnPerguntaNaoRespondida(){
                return this.primeiraPerguntaNaoRespondidaId === this.perguntaAtual.id;
            }
        },

        apollo: {


            getPerguntaAtual: {
                query: gql`
                  query getPerguntaAtual {
                      getPerguntaAtual {
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
                    this.perguntaAtual = res.data.getPerguntaAtual;

                    this.statusSelecionado = this.perguntaAtual ? this.perguntaAtual.status.nome : null;
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
                    getPrimeiraPerguntaNaoRespondida {
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
                    this.primeiraPerguntaNaoRespondida = res.data.getPrimeiraPerguntaNaoRespondida;
                    this.primeiraPerguntaNaoRespondidaId = this.primeiraPerguntaNaoRespondida.id || null;
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
            },

        }
    }
</script>

<style scoped>

</style>