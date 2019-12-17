<template>
  <div>
    <Header titulo="Administrar Equipes"/>
    <v-container fluid >
      <v-row>
        <v-col cols="12">

          <v-data-table
            :headers="headers"
            :items="listaEquipes"
            sort-by="calories"
            class="elevation-1"
          >
            <template v-slot:top>
              <v-toolbar flat color="white">
                <v-toolbar-title>Equipes</v-toolbar-title>
                <v-divider
                  class="mx-4"
                  inset
                  vertical
                ></v-divider>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" persistent max-width="600px">
                  <template v-slot:activator="{ on }">
                    <v-btn color="primary" dark v-on="on" title="Cadastrar Equipe" >

                      <v-icon>mdi-plus-box-multiple</v-icon>

                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="headline">Equipe</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container >
                        <v-form ref="formCadEquipes">

                          <v-row>
                            <v-col cols="12">
                              <div
                                v-for="n in 4"  :key="n" >

                                <div class="mb-2 pa-2  blue-grey lighten-5" >

                                  <h3 class="text-center" >Participante {{ n }}</h3>

                                  <v-text-field
                                    label="Nome completo *"
                                    required
                                    :rules="rules.campoObrigatorio"
                                    v-model="novaEquipe[n-1].nome"
                                  ></v-text-field>

                                  <v-text-field
                                    label="Data nascimento *"
                                    required
                                    :rules="[rules.validarData]"
                                    v-mask="'##/##/####'"
                                    v-model="novaEquipe[n-1].data_nascimento"
                                  ></v-text-field>

                                </div>
                              </div>
                            </v-col>
                          </v-row>

                        </v-form>
                      </v-container>
                      <small>*Indica campo obrigatório</small>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="grey darken-1" text @click="dialog = false">Fechar</v-btn>
                      <v-btn  color="green text-white"  @click.prevent="salvarEquipe">Salvar</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
            <template v-slot:item.action="{ item }">
              <v-icon
                small
                class="mr-2"
                @click="editItem(item)"
              >
                mdi-pencil
              </v-icon>
              <v-icon
                small
                @click="deleteItem(item)"
              >
                mdi-delete
              </v-icon>
            </template>
            <template v-slot:no-data>
              <v-btn color="primary" >Reset</v-btn>
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
  import {mask} from 'vue-the-mask'
  import moment from 'moment'
  export default {
    directives: {mask},
    components: {
      Header
    },
    data: () => ({
      equipes: [],
      dialog: false,
      novaEquipe: [],
      headers: [
        {
          text: 'Equipe',
          align: 'left',
          value: 'nome',
        },
        { text: 'Categoria', value: 'categoria' },
        { text: 'Ações', value: 'action', sortable: false },
      ],

      desserts: [],
      editedIndex: -1,
      date: null,
      menu: false,
    }),
    beforeMount() {
      this.novaEquipe = this.setEquipe();
    },
    methods: {
      setEquipe() {
        const participantes = [];
        for (let n = 0; n <4; n += 1) {
          participantes.push({nome: '', data_nascimento: ''})
        }
        return participantes;
      },
      async formatarDataNascimento() {
        return Object.values(this.novaEquipe).map(participante => {
          const data_nascimento = moment(participante.data_nascimento, 'DD/MM/YYYY').format("YYYY-MM-DD");
          return {
            ...participante,
            data_nascimento
          }
        });
      },
      async salvarEquipe() {
        if (this.$refs.formCadEquipes.validate()) {

          const dados = await this.formatarDataNascimento();

          this.$apollo
            .mutate({
              mutation: gql`
                  mutation ($dados: [ParticipanteInput]) {
                    novaEquipe(dados: $dados) {
                      id
                      nome
                      participantes {
                        id
                        nome
                        data_nascimento
                      }
                    }
                  }
              `,
              variables: {dados: dados}
            })
            .then(() => {
              this.Helper.exibirMensagem("Equipe cadastrada com sucesso!", 'success', 3000);
              this.$apollo.queries.getEquipes.refetch();
              this.$refs.formCadEquipes.reset()
            })
            .catch(e => {
              const msg = e.graphQLErrors[0].message || "Ocorreu um erro. Tente novamente.";
              this.Helper.exibirMensagem(msg, 'error', 3000);
            });

        }
      },


      editItem (item) {
        this.editedIndex = this.desserts.indexOf(item)
        this.dialog = true
      },

      deleteItem (item) {
        const index = this.desserts.indexOf(item)
        confirm('Are you sure you want to delete this team?') && this.desserts.splice(index, 1)
      },

      close () {
        this.dialog = false
      }

    },
    watch: {
      dialog (val) {
        val || this.close()
      },
    },

    computed: {
      listaEquipes() {
        return this.equipes.map(equipe => {

          let categoria = equipe.categoria || null;
          if (categoria) {
            categoria = categoria.descricao;
          }

          return {
            id: equipe.id,
            nome: equipe.nome,
            categoria: categoria,
          }
        })
      },
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      },
      rules() {
        return {
          campoObrigatorio: [v => !!v || "Campo obrigatório"],
          validarData: v => {
            if (v === "" || v === undefined) {
              return "Campo Obrigatório";
            }
            if (v != undefined && v.length >= 8) {
              return this.Helper.validarData(v || "") || "Fomato inválido";
            }
            return true;
          }
        };
      }
    },
    apollo: {
      // They key is the name of the data property
      // on the component that you intend to populate.
      getEquipes: {
        // Yes, this looks confusing.
        // It's just normal GraphQL.
        query: gql`
          query getEquipes {
              getEquipes{
              id
              nome
              categoria {
                id
                nome
                descricao
                idade_min
                idade_max
              }
              participantes {
                id
                nome
                data_nascimento
              }
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
