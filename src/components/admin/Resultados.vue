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
            <v-row>
                <v-col>
                    <v-data-table
                            :headers="headersIndividual"
                            :items="resultadoEquipeInfantil"
                            item-key="name"
                            class="elevation-1"
                    >
                        <template v-slot:top>
                            <v-toolbar flat>
                                <v-toolbar-title> Categoria: Infantil (de 6 até 12 anos)</v-toolbar-title>
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
        data () {
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
                        value: 'acertos_50_pontos',
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
                resultadoEquipeAldulto: [],


            }
        },
        apollo: {

            getResultadoInfantil: {
                query: gql`
                  query getResultadoCopa($nome_categoria: String!, $tipo: String! ) {
                    getResultadoCopa(nome_categoria: $nome_categoria, tipo: $tipo) {
                        classificacao
                        nome
                        pontuacao
                        acertos_consecutivos
                        acertos_50_pontos
                    }
                  }
                `,
                variables(){
                    return {
                        nome_categoria: 'infantil',
                        tipo: 'equipe',
                    }
                },
                result(res) {
                    this.resultadoEquipeInfantil = res.data.getResultadoCopa;
                },
                catch() {
                    this.Helper.exibirMensagem("error", 'error', 3000);
                }
            },

            getResultadoJuvenil: {
                query: gql`
                  query getResultadoCopa($nome_categoria: String!, $tipo: String! ) {
                    getResultadoCopa(nome_categoria: $nome_categoria, tipo: $tipo) {
                        classificacao
                        nome
                        pontuacao
                        acertos_consecutivos
                        acertos_50_pontos
                    }
                  }
                `,
                variables(){
                    return {
                        nome_categoria: 'juvenil',
                        tipo: 'equipe',
                    }
                },
                result(res) {
                    this.resultadoEquipeJuvenil = res.data.getResultadoCopa;
                },
                catch() {
                    this.Helper.exibirMensagem("error", 'error', 3000);
                }
            },

            getResultadoAdulto: {
                query: gql`
                  query getResultadoCopa($nome_categoria: String!, $tipo: String! ) {
                    getResultadoCopa(nome_categoria: $nome_categoria, tipo: $tipo) {
                        classificacao
                        nome
                        pontuacao
                        acertos_consecutivos
                        acertos_50_pontos
                    }
                  }
                `,
                variables(){
                    return {
                        nome_categoria: 'adulto',
                        tipo: 'equipe',
                    }
                },
                result(res) {
                    this.resultadoEquipeAdulto = res.data.getResultadoCopa;
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