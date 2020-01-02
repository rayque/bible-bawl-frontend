<template>
    <div>
        <Header titulo="Resultados"/>
        <v-card outlined>
            <div class="text-center">
                <h1 class="title pa-2">
                    Resultado por Equipe
                </h1>
                <v-divider></v-divider>
            </div>
            <v-divider></v-divider>

            <v-row class="mb-5">
                <v-col>
                    <v-data-table
                            :headers="headersEquipe"
                            :items="resultadoEquipeInfantil"
                            item-key="classifiacao"
                            class="elevation-10"
                    >
                        <template v-slot:top>
                            <v-toolbar flat>
                                <v-toolbar-title> Categoria: Infantil (de 6 até 12 anos)</v-toolbar-title>
                            </v-toolbar>
                        </template>
                    </v-data-table>

                </v-col>
            </v-row>

            <v-row class="mb-5">
                <v-col>
                    <v-data-table
                            :headers="headersEquipe"
                            :items="resultadoEquipeJuvenil"
                            item-key="classifiacao"
                            class="elevation-10"
                    >
                        <template v-slot:top>
                            <v-toolbar flat>
                                <v-toolbar-title> Categoria: Juvenil (de 13 até 25 anos)</v-toolbar-title>
                            </v-toolbar>
                        </template>
                    </v-data-table>

                </v-col>
            </v-row>

            <v-row class="mb-5">
                <v-col>
                    <v-data-table
                            :headers="headersEquipe"
                            :items="resultadoEquipeAdulto"
                            item-key="classifiacao"
                            class="elevation-10"
                    >
                        <template v-slot:top>
                            <v-toolbar flat>
                                <v-toolbar-title> Categoria: Adulto (acima de 25)</v-toolbar-title>
                            </v-toolbar>
                        </template>
                    </v-data-table>

                </v-col>
            </v-row>


            <div class="text-center">
                <h1 class="title pa-2">
                    Resultado Individual
                </h1>
                <v-divider></v-divider>
            </div>
            <v-divider></v-divider>

            <v-row class="mb-5">
                <v-col>
                    <v-data-table
                            :headers="headersIndividual"
                            :items="resultadoIndividualInfantil"
                            item-key="classificacao"
                            class="elevation-10"
                    >
                        <template v-slot:top>
                            <v-toolbar flat>
                                <v-toolbar-title> Categoria: Infantil (de 6 até 12 anos)</v-toolbar-title>
                            </v-toolbar>
                        </template>
                    </v-data-table>

                </v-col>
            </v-row>

            <v-row class="mb-5">
                <v-col>
                    <v-data-table
                            :headers="headersIndividual"
                            :items="resultadoIndividualJuvenil"
                            item-key="classificacao"
                            class="elevation-10"
                    >
                        <template v-slot:top>
                            <v-toolbar flat>
                                <v-toolbar-title> Juvenil (de 13 até 25 anos) </v-toolbar-title>
                            </v-toolbar>
                        </template>
                    </v-data-table>

                </v-col>
            </v-row>

            <v-row class="mb-5">
                <v-col>
                    <v-data-table
                            :headers="headersIndividual"
                            :items="resultadoIndividualAdulto"
                            item-key="classificacao"
                            class="elevation-10"
                    >
                        <template v-slot:top>
                            <v-toolbar flat>
                                <v-toolbar-title> Adulto (acima de 25) </v-toolbar-title>
                            </v-toolbar>
                        </template>
                    </v-data-table>

                </v-col>
            </v-row>


        </v-card>
    </div>
</template>

<script>
    import Header from "../layouts/Header";
    import gql from "graphql-tag";

    export default {
        name: "PainelPerguntas",
        components: {
            Header
        },
        data() {
            return {
                headersEquipe: [
                    {
                        text: 'Classificação',
                        value: 'classificacao',
                        align: 'center'
                    },
                    {
                        text: 'Equipe',
                        align: 'left',
                        value: 'nome',
                    },
                    {
                        text: 'Pontuação',
                        value: 'pontuacao',
                        align: 'center'
                    },
                    {
                        text: 'Acertos de 50 Pontos',
                        value: 'acertos_bonus',
                        align: 'center'
                    },
                ],
                headersIndividual: [
                    {
                        text: 'Classificação',
                        value: 'classificacao',
                        align: 'center'
                    },
                    {
                        text: 'Participante',
                        align: 'left',
                        value: 'nome',
                    },
                    {
                        text: 'Pontuação',
                        value: 'pontuacao',
                        align: 'center'
                    },
                    {
                        text: 'Acertos Consecutivos',
                        value: 'acertos_consecutivos',
                        align: 'center'
                    },
                ],
                resultadoEquipeInfantil: [],
                resultadoEquipeJuvenil: [],
                resultadoEquipeAdulto: [],
                resultadoIndividualInfantil: [],
                resultadoIndividualJuvenil: [],
                resultadoIndividualAdulto: [],


            }
        },
        apollo: {

            getResultadoEquipeInfantil: {
                query: gql`
                  query  getResultadoCopa($nome_categoria: String!, $tipo: String! ) {
                    getResultadoEquipeInfantil: getResultadoCopa(nome_categoria: $nome_categoria, tipo: $tipo) {
                        classificacao
                        nome
                        pontuacao
                        acertos_consecutivos
                        acertos_bonus
                    }
                  }
                `,
                variables() {
                    return {
                        nome_categoria: 'infantil',
                        tipo: 'equipe',
                    }
                },
                result({data}) {
                    this.resultadoEquipeInfantil = data.getResultadoEquipeInfantil;
                },
                catch() {
                    this.Helper.exibirMensagem("error", 'error', 3000);
                }
            },

            getResultadoEquipeJuvenil: {
                query: gql`
                  query getResultadoCopa($nome_categoria: String!, $tipo: String! ) {
                    getResultadoEquipeJuvenil: getResultadoCopa(nome_categoria: $nome_categoria, tipo: $tipo) {
                        classificacao
                        nome
                        pontuacao
                        acertos_consecutivos
                        acertos_bonus
                    }
                  }
                `,
                variables() {
                    return {
                        nome_categoria: 'juvenil',
                        tipo: 'equipe',
                    }
                },
                result({data}) {
                    this.resultadoEquipeJuvenil = data.getResultadoEquipeJuvenil;
                },
                catch() {
                    this.Helper.exibirMensagem("error", 'error', 3000);
                }
            },

            getResultadoEquipeAdulto: {
                query: gql`
                  query getResultadoCopa($nome_categoria: String!, $tipo: String! ) {
                    getResultadoEquipeAdulto: getResultadoCopa(nome_categoria: $nome_categoria, tipo: $tipo) {
                        classificacao
                        nome
                        pontuacao
                        acertos_consecutivos
                        acertos_bonus
                    }
                  }
                `,
                variables() {
                    return {
                        nome_categoria: 'adulto',
                        tipo: 'equipe',
                    }
                },
                result({data}) {
                    this.resultadoEquipeAdulto = data.getResultadoEquipeAdulto;
                },
                catch() {
                    this.Helper.exibirMensagem("error", 'error', 3000);
                }
            },

            getResultadoIndividualInfantil: {
                query: gql`
                  query getResultadoCopa($nome_categoria: String!, $tipo: String! ) {
                    getResultadoIndividualInfantil: getResultadoCopa(nome_categoria: $nome_categoria, tipo: $tipo) {
                        classificacao
                        nome
                        pontuacao
                        acertos_consecutivos
                        acertos_bonus
                    }
                  }
                `,
                variables() {
                    return {
                        nome_categoria: 'infantil',
                        tipo: 'individual',
                    }
                },
                result({data}) {
                    this.resultadoIndividualInfantil = data.getResultadoIndividualInfantil;

                },
                catch() {
                    this.Helper.exibirMensagem("error", 'error', 3000);
                }
            },

            getResultadoIndividualJuvenil: {
                query: gql`
                  query getResultadoCopa($nome_categoria: String!, $tipo: String! ) {
                    getResultadoIndividualJuvenil: getResultadoCopa(nome_categoria: $nome_categoria, tipo: $tipo) {
                        classificacao
                        nome
                        pontuacao
                        acertos_consecutivos
                        acertos_bonus
                    }
                  }
                `,
                variables() {
                    return {
                        nome_categoria: 'juvenil',
                        tipo: 'individual',
                    }
                },
                result({data}) {
                    this.resultadoIndividualJuvenil = data.getResultadoIndividualJuvenil;
                },
                catch() {
                    this.Helper.exibirMensagem("error", 'error', 3000);
                }
            },

            getResultadoIndividualAdulto: {
                query: gql`
                  query getResultadoCopa($nome_categoria: String!, $tipo: String! ) {
                    getResultadoIndividualAdulto: getResultadoCopa(nome_categoria: $nome_categoria, tipo: $tipo) {
                        classificacao
                        nome
                        pontuacao
                        acertos_consecutivos
                        acertos_bonus
                    }
                  }
                `,
                variables() {
                    return {
                        nome_categoria: 'adulto',
                        tipo: 'individual',
                    }
                },
                result({data}) {
                    this.resultadoIndividualAdulto = data.getResultadoIndividualAdulto;
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
            },

        }
    }
</script>

<style scoped>

</style>