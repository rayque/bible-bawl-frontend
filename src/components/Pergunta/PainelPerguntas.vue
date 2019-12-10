<template>
    <v-card outlined >
        <div class="text-center">
            <h1  class="display-1 pa-2">
                Painel de Perguntas
            </h1>
            <v-divider></v-divider>
        </div>

        <v-row dense class="pa-4">
            <v-col cols="4">
                <v-card
                    class="pa-2"
                    tile
                >
                    <div class="mb-2 text-center" >
                        <span class="headline">Anterior</span>
                    </div>
                    <div class="mb-2 text-center" >
                        <span class="headline"> {{ perguntaAnterior }} </span>
                    </div>
                </v-card>
            </v-col>
            <v-col cols="4">
                <v-card
                    class="pa-2"
                    tile
                >
                    <div class="mb-2 text-center" >
                        <span class="headline">Atual</span>
                    </div>
                    <div class="mb-2 text-center" >
                        <span class="display-2"> {{ perguntaAtual }} </span>
                    </div>
                </v-card>
            </v-col>
            <v-col cols="4">
                <v-card
                    class="pa-2"
                    tile
                >
                    <div class="mb-2 text-center" >
                        <span class="headline">Próxima</span>
                    </div>
                    <div class="mb-2 text-center" >
                        <span class="headline"> {{ proximaPergunta }} </span>
                    </div>
                </v-card>
            </v-col>
        </v-row>

        <v-divider></v-divider>

        <v-row dense class="pa-4">
            <v-col cols="4">
                <v-btn  @click="setPergunta(perguntaAnterior)"  x-large block color="grey" >Anterior</v-btn>
            </v-col>
            <v-col cols="4">
                <v-btn  @click="setPergunta(0)"  x-large block color="red" >Bloquear</v-btn>
            </v-col>
            <v-col cols="4">
                <v-btn  @click="setPergunta(proximaPergunta)" x-large block color="primary" dark>Próxima</v-btn>
            </v-col>
        </v-row>

        <v-row dense class="pa-4">
            <v-col cols="2">
                <v-text-field
                    v-model="perguntaEspecifica"
                    label="Pergunta Específica"
                    outlined
                    type="number"
                ></v-text-field>
            </v-col>
            <v-col cols="2">
                <v-btn  v-if="perguntaEspecifica" @click="setPergunta(perguntaEspecifica)" x-large block color="primary" dark>Selecionar</v-btn>
                <v-btn  disabled v-if="!perguntaEspecifica" x-large block color="primary" dark>Selecionar</v-btn>
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
        }),
        methods: {
          setPergunta(p) {
              const pergunta =  parseInt(p);

              this.$apollo
                  .mutate({
                      mutation: gql`
                      mutation ($pergunta: Int!) {
                         setPerguntaAtual(pergunta: $pergunta)
                      }
                  `,
                  variables: {pergunta: pergunta}
                  })
                  .catch(e => {
                      const msg = e.graphQLErrors[0].message || "Ocorreu um erro. Tente novamente.";
                      this.Helper.exibirMensagem(msg, 'error', 3000);
                  });
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


            // Subscriptions
            $subscribe: {
                // When a user is added
                novaPerguntaAtual: {
                    query: gql`
                    subscription {
                          novaPerguntaAtual
                    }
                    `,
                    // Result hook
                    result (data) {
                        /* eslint-enable no-console */
                        // Let's update the local data
                        this.perguntaAtual = data.data.novaPerguntaAtual;


                    },
                },
            },

        }
    }
</script>

<style scoped>

</style>