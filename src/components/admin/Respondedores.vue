<template>
  <div>
    <Header titulo="Administrar Respondedores"/>

    <v-container fluid class="grey lighten-5">
      <v-row>
        <v-col
          cols="12"
        >
          <v-data-table
            :headers="headers"
            :items="respondedores"
            sort-by="calories"
            class="elevation-1"
          >
            <template v-slot:top>
              <v-toolbar flat color="white">
                <v-toolbar-title>Respondedores</v-toolbar-title>
                <v-divider
                  class="mx-4"
                  inset
                  vertical
                ></v-divider>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" persistent max-width="600px">
                  <template v-slot:activator="{ on }">
                    <v-btn color="primary" dark v-on="on">
                      <v-icon>mdi-plus-box-multiple</v-icon>
                    </v-btn>
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
                                ref="nomeInput"
                                v-if="dialog"
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
                      <v-btn color="grey darken-1" text @click="dialog = false">Fechar</v-btn>
                      <v-btn color="green text-white" @click.prevent="salvarRespondedor">Salvar</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>



                <v-dialog v-model="dialogSetEquipe" persistent max-width="600px">
                  <v-card>
                    <v-card-title>
                      <span class="headline">Equipes do respondedor</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-form ref="cadastroRespondedor">

                          <v-row>
                            <v-col cols="12">
                              <p>Selecione no máximo 2 equipes.</p>
                              <v-select
                                v-model="equipesSelecionadas"
                                :items="listEquipes"
                                attach
                                chips
                                label="Equipes"
                                multiple
                                v-on:input="limiter"
                                item-text="nome"
                                item-value="id"
                                closeOnContentClick
                              ></v-select>
                            </v-col>
                          </v-row>


                        </v-form>
                      </v-container>
                      <small>*Indica campo obrigatório</small>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="grey darken-1" text @click="dialogSetEquipe = false">Fechar</v-btn>
                      <v-btn color="green text-white" @click.prevent="salvarEquipes">Salvar</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>


              </v-toolbar>
            </template>

            <template v-slot:item.action="{ item }">
              <v-icon
                small
                class="mr-2"
                @click="setEquipe(item)"
              >
                mdi-account-group
              </v-icon>
            </template>

          </v-data-table>


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
      dialogSetEquipe: false,
      equipes: [],
      desserts: [],
      editedIndex: -1,
      editedItem: {
        name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
      },
      defaultItem: {
        name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
      },
      equipesSelecionadas: [],
      respondedorSelecionado: [],

      // nome: '',
      // campoObrigadorio: [v => !!v || "Campo obrigatório"],
      respondedores: [],
      headers: [
        {
          text: 'Nome',
          align: 'left',
          value: 'nome',
        },
        {text: 'Codigo de Acesso', value: 'cod_acesso'},
        {text: 'Actions', value: 'action', sortable: false},

      ],
    }),
    methods: {
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
      },
      limiter(e) {
        if(e.length > 2) {
          e.pop()
        }
      },
      salvarEquipes(){
        this.dialogSetEquipe = false;
        // if (this.$refs.cadastroRespondedor.validate()) {
          this.$apollo
            .mutate({
              mutation: gql`
                  mutation ($dados: setEquipesRespondedorInput!) {
                    setEquipesRespondedor(dados: $dados) {
                      respondedor {
                        id
                      }
                      equipes {
                        id
                      }
                    }
                  }
              `,
              variables: {dados: {
                 idRespondedor: this.respondedorSelecionado,
                 idsEquipes: this.equipesSelecionadas
              }}
            })
            .then(() => {
              this.Helper.exibirMensagem("Equipes selecionadas com sucesso!", 'success', 3000);
              this.$apollo.queries.getRespondedores.refetch();
              // this.$refs.cadastroRespondedor.reset()
            })
            .catch(e => {
              const msg = e.graphQLErrors[0].message || "Ocorreu um erro. Tente novamente.";
              this.Helper.exibirMensagem(msg, 'error', 3000);
            });
        // }


      },
      setEquipe(respondedor) {
        this.respondedorSelecionado = respondedor.id;
        this.equipesSelecionadas = respondedor.equipes.map(equipe => {
          return equipe.id
        });
        this.dialogSetEquipe = true;
      },

      editItem(item) {
        this.editedIndex = this.desserts.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialog = true
      },

      deleteItem(item) {
        const index = this.desserts.indexOf(item);
        confirm('Are you sure you want to delete this item?') && this.desserts.splice(index, 1)
      },

      close() {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1
        }, 300)
      },

      save() {
        if (this.editedIndex > -1) {
          Object.assign(this.desserts[this.editedIndex], this.editedItem)
        } else {
          this.desserts.push(this.editedItem)
        }
        this.close()
      },


    },


    computed: {
      formTitle() {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      },
      listEquipes() {
        let equipesRespondedores = [];
        this.respondedores.forEach(respondedor => {
          respondedor.equipes.forEach(equipe => {
            equipesRespondedores.push(equipe.id);
          });
        });
        /* eslint-disable no-console */
        // console.log(this.equipesSelecionadas);

        const equipesDisponiveis = this.equipes.filter(equipe => {
          return !equipesRespondedores.includes(equipe.id) || this.equipesSelecionadas.includes(equipe.id);
        });

        return equipesDisponiveis;

      }
    },

    watch: {
      dialog(val) {
        val || this.close()
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
              id
              nome
              cod_acesso
                equipes {
                id
                nome
              }
            }
          }
        `,
        result(res) {
          /* eslint-disable no-console */
          // console.log(res.data.getRespondedores);
          /* eslint-enable no-console */
          this.respondedores = res.data.getRespondedores || [];
        }
      },
      getEquipes: {
        // Yes, this looks confusing.
        // It's just normal GraphQL.
        query: gql`
          query getEquipes {
              getEquipes{
              id
              nome
            }
          }
        `,
        result(res) {
          /* eslint-disable no-console */
          // console.log(res.data.getRespondedores);
          /* eslint-enable no-console */
          this.equipes = res.data.getEquipes || [];
        }
      }
    }
  }
</script>
