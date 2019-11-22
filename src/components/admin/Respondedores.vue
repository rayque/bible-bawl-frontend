<template>
  <div>
    <Header titulo="foo"  sub-titulo="bar" />

    <v-container fluid class="grey lighten-5">
      <v-row>
        <v-col
          cols="12"
        >
          <v-dialog v-model="dialog" persistent max-width="600px">
              <template v-slot:activator="{ on }">
              <v-btn color="primary" dark v-on="on">Cadastrar Respondedor</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">Respondedor</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-form ref="cadastroRespondedor">

                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          label="Nome completo *"
                          required
                          :rules="campoObrigadorio"
                          v-model="nome"
                        ></v-text-field>
                      </v-col>
                    </v-row>


                  </v-form>
                </v-container>
                <small>*Indica campo obrigatório</small>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialog = false">Fechar</v-btn>
                <v-btn color="blue darken-1" text @click="salvarRespondedor">Salvar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>


        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
  import Header from "./../layouts/Header"
  import gql from 'graphql-tag'
  export default {
    components: {
      Header
    },
    data: () => ({
      dialog: false,
      nome: '',
      campoObrigadorio: [v => !!v || "Campo obrigatório"],
    }),
    methods: {
      salvarRespondedor() {
        if (this.$refs.cadastroRespondedor.validate()) {
          this.nome = this.nome;
        }

      }
    },
    apollo: {
      // They key is the name of the data property
      // on the component that you intend to populate.
      getRespondedores: {
        // Yes, this looks confusing.
        // It's just normal GraphQL.
        query: gql`
          query getRespondedores {
            getRespondedores {
              id nome cod_acesso
            }
          }
        `,
        result(res) {
          /* eslint-disable no-console */
          console.log(res);
          /* eslint-enable no-console */
        }
      }
    }
  }
</script>
