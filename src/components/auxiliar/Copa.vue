<template>
    <div>
        <Header titulo="Copa"/>

        <v-alert
                v-if="!perguntaAtual"
                tile
                color="primary"
                outlined
                border="left"
                text
                type="info"
        >
            Não há perguntas disponíveis
        </v-alert>

        <v-row v-if="perguntaAtual">
            <v-col cols="12">
                <v-card>
                    <v-card-title class="headline">Pergunta {{perguntaAtual.id}}</v-card-title>
                </v-card>
            </v-col>
        </v-row>

        <v-row no-gutters v-if="perguntaAtual">
            <v-col :cols="equipes/12" v-for="(equipe, indexEquipe) in listaEquipes" :key="indexEquipe" >
                <v-card flat class="text-center white--text">
                    <v-dialog
                            v-model="dialog"
                            width="500"
                    >
                        <template v-slot:activator="{ on }">
                            <div class="text-center" >
                                <v-btn
                                        outlined tile
                                        class="mt-2"
                                        color="primary"
                                        v-on="on"
                                        @click="showEquipe(equipe)"
                                >
                                    Equipe {{equipe.sigla}}
                                </v-btn>

                            </div>
                        </template>
                        <v-divider></v-divider>

                        <v-card v-if="dadosEquipe">
                            <v-card-title
                                    class="title grey lighten-2"
                                    primary-title
                            >
                                Informações da equipe
                            </v-card-title>

                            <v-card-text class="pa-4">
                                <p class="body-1"><b> Equipe:</b> {{ dadosEquipe.nome }}</p>
                                <p class="body-1"><b> Sigla:</b> {{ dadosEquipe.sigla }}</p>
                                <p class="body-1"><b> Categoria: </b>{{ dadosEquipe.categoria.descricao }}</p>

                                <v-divider></v-divider>

                                <v-list>
                                    <p class="subtitle-1">Participantes</p>
                                    <v-list-item
                                            v-for="participante in dadosEquipe.participantes"
                                            :key="participante.id"
                                    >
                                        <v-list-item-content>
                                            <v-list-item-title v-text="participante.nome"></v-list-item-title>
                                        </v-list-item-content>

                                    </v-list-item>
                                </v-list>

                            </v-card-text>

                            <v-divider></v-divider>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn
                                        color="grey darken-1"
                                        outlined tile
                                        @click="dialog = false"
                                >
                                    fechar
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>

                    <v-row no-gutters>

                        <v-col cols="12" class="text-center"
                               v-for="(participante, indexParticipante) in equipe.participantes"
                               :key="indexParticipante">

                            <v-btn
                                    v-if="respostasCertas.indexOf(participante.id) === -1"
                                    @click="salvarRespota(participante.id)"
                                    color="grey lighten-1"
                                    class="mt-3 mb-3"
                                     outlined tile

                            >
                                <v-icon left>mdi-account-remove-outline</v-icon> <span class="caption"> {{  getFirstName(participante.nome)}} </span>
                            </v-btn>

                            <v-btn v-if="respostasCertas.indexOf(participante.id) !== -1"
                                   @click="salvarRespota(participante.id)"
                                   color="green darken-1"
                                   class="mt-3 mb-3"
                                    outlined tile
                                   elevation="6"
                            >
                                <v-icon left>mdi-account-check-outline</v-icon> <span class="caption"> {{  getFirstName(participante.nome)}} </span>
                            </v-btn>

                        </v-col>

                    </v-row>

                </v-card>

            </v-col>
        </v-row>

    </div>
</template>
<script>
    import Header from "./../layouts/Header"
    import gql from 'graphql-tag'
    import {mask} from 'vue-the-mask'
    import {mapGetters} from 'vuex';

    export default {
        directives: {mask},
        components: {
            Header
        },
        data: () => ({
            result: null,
            dialog: false,
            equipes: [],
            perguntaAtual: null,
            loader: null,
            loading5: false,
            respostasCertas: [],
            novaPerguntaAtual: '',
            dadosEquipe: null,
        }),
        methods: {
            salvarRespota(id) {
                const indexTemResposta = this.respostasCertas.indexOf(id);
                const resposta = indexTemResposta === -1;

                this.Helper.setLoadingAtivo();
                this.$apollo
                    .mutate({
                        mutation: gql`
                          mutation ($dados: RespostaInput!) {
                            setResposta(dados: $dados)
                          }
                      `,
                        variables: {
                            dados: {
                                participante_id: id,
                                pergunta_id: this.perguntaAtual.id,
                                resposta: resposta
                            }
                        }
                    })
                    .then(() => {

                        if (indexTemResposta === -1) {
                            this.respostasCertas.push(id);
                        } else {
                            this.respostasCertas.splice(indexTemResposta, 1);
                        }

                        this.Helper.setLoadingAtivo(false);
                    })
                    .catch(e => {
                        const msg = e.graphQLErrors[0].message || "Ocorreu um erro. Tente novamente.";
                        this.Helper.exibirMensagem(msg, 'error', 3000);

                        this.Helper.setLoadingAtivo(false);
                    });
            },
            resetEquipes() {
                this.equipes.forEach(equipe => {
                    equipe.participantes.forEach(participante => {
                        participante.resposta = false;
                    })
                })
            },
            setNovaPergunta() {
                this.respostasCertas = [];
                this.perguntaAtual = this.novaPerguntaAtual
            },
            showEquipe(equipe) {
                this.dadosEquipe = equipe;
            },
            getFirstName(name) {
                return  name.replace(/ .*/,'');
            }

        },
        watch: {
            loader() {
                const l = this.loader
                this[l] = !this[l]

                setTimeout(() => (this[l] = false), 3000)

                this.loader = null
            },
        },
        computed: {
            ...mapGetters(['getAuth']),
            listaEquipes() {
                return this.equipes;
            }
        },
        apollo: {
            getRespondedor: {
                query: gql`
                  query getRespondedor($id: Int!) {
                    getRespondedor(id: $id){
                        id
                        nome
                        cod_acesso
                        equipes {
                            id
                            nome
                            sigla
                            categoria {
                                id
                                nome
                                descricao
                            }
                            participantes {
                                id
                                nome
                            }
                        }
                    }
                  }
                `,
                variables() {
                    return {
                        id: this.getAuth.respondedorId
                    };
                },
                skip() {
                    return !this.getAuth.respondedorId
                },
                result(res) {
                    this.respondedor = res.data.getRespondedor || [];
                    this.equipes = this.respondedor.equipes || [];
                    this.resetEquipes();
                },
                catch() {
                    this.Helper.exibirMensagem("error", 'error', 3000);
                }
            },
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
                        this.novaPerguntaAtual = data.data.novaPerguntaAtual;
                        this.setNovaPergunta()

                    },
                },
            },
        }
    }
</script>
<style scoped>
    .equipe-0 {
        /* background-color: #FFA726; */
        background-color: #FFE0B2;
    }

    .equipe-1 {
        /* background-color: #78909C; */
        background-color: #CFD8DC;
    }

    .equipe-2 {
        /* background-color: #8D6E63; */
        background-color: #D7CCC8;
    }

    .equipe-title-0 {
        background-color: #FF9800;
    }

    .equipe-title-1 {
        background-color: #607D8B;
    }

    .equipe-title-2 {
        background-color: #795548;
    }

    .custom-loader {
        animation: loader 1s infinite;
        display: flex;
    }

    @-moz-keyframes loader {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }

    @-webkit-keyframes loader {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }

    @-o-keyframes loader {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }

    @keyframes loader {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }
</style>
