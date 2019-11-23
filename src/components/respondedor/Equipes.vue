<template>
  <div>
    <Header titulo="Bar"/>

    <v-container fluid class="grey lighten-5">
      <v-row>
        <v-col
          cols="12"
        >
          <v-dialog v-model="dialog" persistent max-width="600px">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark v-on="on">Cadastrar Equipe</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">Equipe</span>
              </v-card-title>
              <v-card-text>
                <v-container >
                  <v-form ref="cadastroRespondedor">

                    <v-row>
                      <v-col cols="12">

                        <v-text-field
                          label="Nome completo *"
                          required
                          :rules="campoObrigadorio"
                          v-model="nome"
                        ></v-text-field>

                        <v-text-field
                          label="Data nascimento *"
                          required
                          :rules="campoObrigadorio"
                          v-model="dtNascimento"
                          v-mask="'##/##/####'"
                        ></v-text-field>




                        <v-menu
                          ref="menu"
                          v-model="menu"
                          :close-on-content-click="false"
                          transition="scale-transition"
                          offset-y
                          full-width
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on }">
                            <v-text-field
                              locale="pt-br"
                              v-model="date"
                              label="Data Nascimento"
                              readonly
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            locale="pt-br"
                            ref="picker"
                            v-model="date"
                            :max="new Date().toISOString().substr(0, 10)"
                            min="01/01/1950"
                            @change="save"
                          ></v-date-picker>
                        </v-menu>



                      </v-col>
                    </v-row>


                  </v-form>
                </v-container>
                <small>*Indica campo obrigatório</small>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="grey darken-1" text @click="dialog = false">Fechar</v-btn>
                <v-btn  color="green text-white"  @click.prevent="salvarRespondedor">Salvar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>


        </v-col>
      </v-row>
    </v-container>

    <v-container fluid >
      <v-row>
        <v-col cols="12">
          <v-data-table
            :headers="headers"
            :items="respondedores"
            :items-per-page="8"
            class="elevation-1"
          ></v-data-table>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
  import Header from "./../layouts/Header"
  import gql from 'graphql-tag'
  import {mask} from 'vue-the-mask'
  export default {
    directives: {mask},
    components: {
      Header
    },
    data: () => ({
      dialog: false,
      nome: '',
      dtNascimento: '',
      campoObrigadorio: [v => !!v || "Campo obrigatório"],
      respondedores: [],
      headers: [
        {
          text: 'Nome',
          align: 'left',
          value: 'nome',
        },
        { text: 'Codigo de Acesso', value: 'cod_acesso' },

      ],

      date: null,
      menu: false,
    }),
    methods: {

      save (date) {
        this.$refs.menu.save(date)
      },
      salvarRespondedor() {
        if (this.$refs.cadastroRespondedor.validate()) {
          this.$apollo
            .mutate({
              mutation: gql`
                  mutation ($nome: String!) {
                    novoRespondedor(nome: $nome) {
                    id nome cod_acesso
                    }
                  }
              `,
              variables: {nome: this.nome}
            })
            .then(() => {
              this.Helper.exibirMensagem("Respondedor cadastrado com sucesso!", 'success', 3000);
              this.$apollo.queries.getRespondedores.refetch();
              this.$refs.cadastroRespondedor.reset()
            })
            .catch(e => {
              const msg = e.graphQLErrors[0].message || "Ocorreu um erro. Tente novamente.";
              this.Helper.exibirMensagem(msg, 'error', 3000);
            });

        }
      }
    },

    watch: {
      menu (val) {
        val && setTimeout(() => (this.$refs.picker.activePicker = 'DAY'))
      },
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
          // console.log(res.data.getRespondedores);
          /* eslint-enable no-console */
          this.respondedores = res.data.getRespondedores || [];
        }
      }
    }
  }
</script>
