<template>
    <v-card outlined>
        <div class="text-center">
            <h1 class="display-1 pa-2">
                Painel de Perguntas
            </h1>
            <v-divider></v-divider>
        </div>

        <v-row dense class="pa-4" v-if="!perguntaAtual">
            <v-col sm="6">
                <v-alert type="info">
                    Não há perguntas disponíveis.
                </v-alert>
            </v-col>
            <v-col sm="6">
                <v-btn @click="setPergunta(primeiraPerguntaNaoRespondida.id)" x-large block color="success" dark>Iniciar
                </v-btn>
            </v-col>
        </v-row>

        <v-row dense v-if="perguntaAtual" class="pa-4">
            <v-col cols="4">
                <v-card class="pa-2 grey lighten-2 grey--text headline text-center" tile>
                    <div class="mb-2 text-center">
                        <span class="headline">Anterior</span>
                    </div>
                    <div class="mb-2 text-center">
                        <span class="headline"> {{ perguntaAnterior }} </span>
                    </div>
                </v-card>
            </v-col>
            <v-col cols="4">
                <v-card
                        class="pa-2"
                        tile
                        dark
                        @click="setStatusPergunta('respondido', perguntaAtual.id)"
                        color="success"

                >
                    <div class="mb-2 text-center">
                        <span class="headline">Atual</span>
                    </div>
                    <div class="mb-2 text-center">
                        <span class="display-2"> {{ perguntaAtual.id }} </span>
                    </div>
                </v-card>
            </v-col>
            <v-col cols="4">
                <v-card class="pa-2 grey lighten-2 grey--text headline text-center" tile>
                    <div class="mb-2 text-center">
                        <span class="headline">Próxima</span>
                    </div>
                    <div class="mb-2 text-center">
                        <span class="headline"> {{ proximaPergunta }} </span>
                    </div>
                </v-card>
            </v-col>
        </v-row>

        <v-divider></v-divider>

        <v-row dense class="pa-4" v-if="perguntaAtual">
            <v-col  md="4" sm="12">
                <v-btn @click="setPergunta(0)" x-large block outlined  color="red" >Bloquear respostas</v-btn>
            </v-col>
            <v-col  md="4" sm="12">
                <v-btn v-if="perguntaAnterior" @click="setPergunta(perguntaAnterior)" x-large block  outlined>
                    Anterior
                </v-btn>
                <v-btn v-if="!perguntaAnterior" disabled x-large block outlined>Anterior</v-btn>
            </v-col>
            <v-col  md="4" sm="12">
                <v-btn @click="setPergunta(proximaPergunta)"x-large block  outlined >Próxima</v-btn>
            </v-col>
        </v-row>

        <v-row dense class="pa-4" v-if="perguntaAtual">

            <v-col md="2" sm="12">
                <v-text-field
                        v-model="perguntaEspecifica"
                        label="ir para pergunta específica"
                        outlined
                        type="number"
                ></v-text-field>
            </v-col>
            <v-col md="2" sm="12">
                <v-btn v-if="perguntaEspecifica" @click="setPergunta(perguntaEspecifica)" x-large block
                       color="primary" dark>Selecionar
                </v-btn>
                <v-btn disabled v-if="!perguntaEspecifica" x-large block>Selecionar</v-btn>
            </v-col>

            <v-col class="pa-4" md="8" sm="12">

                <v-radio-group  v-model="statusSelecionado" row>
                    <template v-slot:label>
                        <div> <b>Status da Pergunta: </b></div>
                    </template>

                    <v-radio  v-for="status in statusPergunta" :key="status.id"
                              :color="getColorStatus(status.nome)"
                             :label="status.descricao" :value="status.nome"
                    >
                        <template v-slot:label>
                            <div>{{ status.descricao }}</div>
                        </template>
                    </v-radio>
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
            statusPergunta: [],
            statusSelecionado: null ,
        }),
        methods: {
            setPergunta(pergunta) {
                console.log(pergunta);
                this.$apollo
                    .mutate({
                        mutation: gql`
                      mutation ($pergunta: Int!) {
                         setPerguntaAtual(pergunta: $pergunta)}
                  `,
                        variables: {pergunta: parseInt(pergunta)}
                    })
                    .then((res) => {
                        console.log(res);
                        this.perguntaEspecifica = null;
                        this.$apollo.queries.getPrimeiraPerguntaNaoRespondida.refetch();
                    })
                    .catch(e => {
                        const msg = e.graphQLErrors[0].message || "Ocorreu um erro. Tente novamente.";
                        this.Helper.exibirMensagem(msg, 'error', 3000);
                    });
            },

            getColorStatus(status) {
                const colors = {
                    'n_respondido': () => 'default',
                    'respondido': () => 'success',
                    'cancelado': () => 'error',
                };
                return (colors[status])();
            },

            setStatusPergunta(status, pergunta) {
                this.$apollo
                    .mutate({
                        mutation: gql`
                      mutation ($pergunta_id: Int!, $status_name: String!) {
                         setStatusPergunta(pergunta_id: $pergunta_id, status_name: $status_name)
                         }
                  `,
                        variables: {
                            pergunta_id: parseInt(pergunta),
                            status_name:  status.toString()
                        }
                    })
                    .then((result) => {
                        this.$apollo.queries.getPrimeiraPerguntaNaoRespondida.refetch();
                    })
                    .catch(e => {
                        const msg = e.graphQLErrors[0].message || "Ocorreu um erro. Tente novamente.";
                        this.Helper.exibirMensagem(msg, 'error', 3000);
                    });
            }

        },

        watch: {
            perguntaAtual(pergunta) {
                this.statusSelecionado =  pergunta ?  pergunta.status.nome : null;
            }
        },

        computed: {
            perguntaAnterior() {
                return this.perguntaAtual.id - 1;
            },
            proximaPergunta() {
                return this.perguntaAtual.id + 1;
            }
        },

        apollo: {

            getPerguntaAtual: {
                query: gql`
                  query getPerguntaAtual {
                      getPerguntaAtual{
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
                    console.log("-*---------------");
                    console.log(this.primeiraPerguntaNaoRespondida);

                    // this.perguntaAtual = res.data.getPrimeiraPerguntaNaoRespondida;
                },
                catch() {
                    this.Helper.exibirMensagem("error", 'error', 3000);
                }

            },

            getStatusPergunta: {
                query: gql`
                  query getStatusPergunta {
                    getStatusPergunta{
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
            $subscribe: {
                novaPerguntaAtual: {
                    query: gql`
                    subscription {
                            novaPerguntaAtual{
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