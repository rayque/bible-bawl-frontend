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
<!--            <v-row>-->
<!--                <v-col md="4">-->
<!--                    <div class="subtitle-1 font-weight-bold text-center">-->
<!--                        Infantil (de 6 até 12 anos)-->
<!--                    </div>-->
<!--                    <ul>-->
<!--                        <li v-for="i in 15"> {{ i }} - nome equipe nome equipe - 3000 </li>-->
<!--                    </ul>-->
<!--                </v-col>-->
<!--                <v-col md="4">-->
<!--                    <div class="subtitle-1 font-weight-bold text-center">-->
<!--                        Juvenil (de 13 até 25 anos)-->
<!--                    </div>-->
<!--                    <ul>-->
<!--                        <li v-for="i in 15"> nome equipe nome equipe</li>-->
<!--                    </ul>-->
<!--                </v-col>-->
<!--                <v-col md="4">-->
<!--                    <div class="subtitle-1 font-weight-bold text-center">-->
<!--                        Adulto (acima de 25)-->
<!--                    </div>-->
<!--                    <ul>-->
<!--                        <li v-for="i in 15"> nome equipe nome equipe</li>-->
<!--                    </ul>-->
<!--                </v-col>-->
<!--            </v-row>-->
            <v-row>
                <v-col>
                    <v-data-table
                            :headers="headers"
                            :items="desserts"
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
                            :items="desserts"
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
                expanded: [],
                singleExpand: true,
                headers: [
                    {
                        text: 'Classificação',
                        value: 'classificacao',
                        align: 'center'
                    },
                    {
                        text: 'Equipe',
                        align: 'left',
                        value: 'name',
                    },
                    {
                        text: 'Pontuação',
                        value: 'pontuacao',
                        align: 'center'
                    },
                    {
                        text: 'Acertos 50 Pontos',
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
                        value: 'name',
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
                desserts: [
                    {
                        classificacao: 1,
                        name: 'Lorem ipsum dolor sit amet',
                        pontuacao: 159,
                        acertos_50_pontos: 6.0,
                        carbs: 24,
                        protein: 4.0,
                        iron: '1%',
                    },
                    {
                        classificacao: 2,
                        name: 'consectetur adipiscing elit, sed',
                        pontuacao: 237,
                        acertos_50_pontos: 9.0,
                        carbs: 37,
                        protein: 4.3,
                        iron: '1%',
                    },
                    {
                        classificacao: 3,
                        name: 'eiusmod tempor incididunt ut labore ',
                        pontuacao: 262,
                        acertos_50_pontos: 16.0,
                        carbs: 23,
                        protein: 6.0,
                        iron: '7%',
                    },
                    {
                        classificacao: 4,
                        name: 'dolore magna aliqua. Sed',
                        pontuacao: 305,
                        acertos_50_pontos: 3.7,
                        carbs: 67,
                        protein: 4.3,
                        iron: '8%',
                    },
                    {
                        classificacao: 5,
                        name: 'dolore magna aliqua. Sed',
                        pontuacao: 356,
                        acertos_50_pontos: 16.0,
                        carbs: 49,
                        protein: 3.9,
                        iron: '16%',
                    },
                    {
                        classificacao: 6,
                        name: 'dolore magna aliqua. Sed',
                        pontuacao: 375,
                        acertos_50_pontos: 0.0,
                        carbs: 94,
                        protein: 0.0,
                        iron: '0%',
                    },
                    {
                        classificacao: 7,
                        name: 'dolore magna aliqua. Sed',
                        pontuacao: 392,
                        acertos_50_pontos: 0.2,
                        carbs: 98,
                        protein: 0,
                        iron: '2%',
                    },
                    {
                        classificacao: 8,
                        name: 'dolore magna aliqua. Sed',
                        pontuacao: 408,
                        acertos_50_pontos: 3.2,
                        carbs: 87,
                        protein: 6.5,
                        iron: '45%',
                    },
                    {
                        classificacao: 9,
                        name: 'dolore magna aliqua. Sed',
                        pontuacao: 452,
                        acertos_50_pontos: 25.0,
                        carbs: 51,
                        protein: 4.9,
                        iron: '22%',
                    },
                    {
                        classificacao: 10,
                        name: 'dolore magna aliqua. Sed',
                        pontuacao: 518,
                        acertos_50_pontos: 26.0,
                        carbs: 65,
                        protein: 7,
                        iron: '6%',
                    },
                ],

                desserts: [
                    {
                        classificacao: 1,
                        name: 'Lorem ipsum dolor sit amet',
                        pontuacao: 159,
                        acertos_consecutivos: 6.0,
                    },
                    {
                        classificacao: 2,
                        name: 'consectetur adipiscing elit, sed',
                        pontuacao: 237,
                        acertos_consecutivos: 9.0,
                        carbs: 37,
                        protein: 4.3,
                        iron: '1%',
                    },
                    {
                        classificacao: 3,
                        name: 'eiusmod tempor incididunt ut labore ',
                        pontuacao: 262,
                        acertos_consecutivos: 16.0,
                        carbs: 23,
                        protein: 6.0,
                        iron: '7%',
                    },
                    {
                        classificacao: 4,
                        name: 'dolore magna aliqua. Sed',
                        pontuacao: 305,
                        acertos_consecutivos: 3.7,
                        carbs: 67,
                        protein: 4.3,
                        iron: '8%',
                    },
                    {
                        classificacao: 5,
                        name: 'dolore magna aliqua. Sed',
                        pontuacao: 356,
                        acertos_consecutivos: 16.0,
                        carbs: 49,
                        protein: 3.9,
                        iron: '16%',
                    },
                    {
                        classificacao: 6,
                        name: 'dolore magna aliqua. Sed',
                        pontuacao: 375,
                        acertos_consecutivos: 0.0,
                        carbs: 94,
                        protein: 0.0,
                        iron: '0%',
                    },
                    {
                        classificacao: 7,
                        name: 'dolore magna aliqua. Sed',
                        pontuacao: 392,
                        acertos_consecutivos: 0.2,
                        carbs: 98,
                        protein: 0,
                        iron: '2%',
                    },
                    {
                        classificacao: 8,
                        name: 'dolore magna aliqua. Sed',
                        pontuacao: 408,
                        acertos_consecutivos: 3.2,
                        carbs: 87,
                        protein: 6.5,
                        iron: '45%',
                    },
                    {
                        classificacao: 9,
                        name: 'dolore magna aliqua. Sed',
                        pontuacao: 452,
                        acertos_consecutivos: 25.0,
                        carbs: 51,
                        protein: 4.9,
                        iron: '22%',
                    },
                    {
                        classificacao: 10,
                        name: 'dolore magna aliqua. Sed',
                        pontuacao: 518,
                        acertos_consecutivos: 26.0,
                        carbs: 65,
                        protein: 7,
                        iron: '6%',
                    },
                ],
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