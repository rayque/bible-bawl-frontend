<template>
    <div>
        <Header titulo="Administrar Auxiliares"/>

        <v-container fluid class="grey lighten-5">
            <v-row>
                <v-col
                        cols="12"
                >
                    <v-data-table
                            :headers="headers"
                            :items="auxiliares"
                            sort-by="calories"
                            class="elevation-1"
                    >
                        <template v-slot:top>
                            <v-toolbar flat color="white">
                                <v-toolbar-title>Auxiliares</v-toolbar-title>
                                <v-divider
                                        class="mx-4"
                                        inset
                                        vertical
                                ></v-divider>
                                <v-spacer></v-spacer>
                                <v-dialog v-model="dialog" max-width="600px">
                                    <template v-slot:activator="{ on }">
                                        <v-btn color="primary" tile outlined
                                               v-on="on"
                                               title="Adicionar aixiliar"
                                        >
                                            <v-icon>
                                                mdi-plus-box-multiple-outline
                                            </v-icon>
                                        </v-btn>
                                    </template>
                                    <v-card>
                                        <v-card-title>
                                            <span class="headline">Adicionar auxiliar</span>
                                        </v-card-title>
                                        <v-card-text>
                                            <v-container>
                                                <v-form ref="cadastroAuxiliar">

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
                                            <small>*Indica campo
                                                obrigatório</small>
                                        </v-card-text>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn tile outlined
                                                   color="grey darken-1"
                                                   @click="dialog = false">
                                                Fechar
                                            </v-btn>
                                            <v-btn tile outlined color="primary"
                                                   @click.prevent="salvarRespondedor"
                                            >
                                                Salvar
                                            </v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>


                                <v-dialog v-model="dialogSetEquipe"
                                          max-width="600px">
                                    <v-card>
                                        <v-card-title>
                                            <span class="headline">Equipes do auxiliar</span>
                                        </v-card-title>
                                        <v-card-text>
                                            <v-container>
                                                <v-form ref="cadastroAuxiliar">

                                                    <v-row>
                                                        <v-col cols="12">
                                                            <p>Selecione no
                                                                máximo 2
                                                                equipes.</p>
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
                                            <small>*Indica campo
                                                obrigatório</small>
                                        </v-card-text>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn tile outlined
                                                   color="grey darken-1"
                                                   @click="dialogSetEquipe = false">
                                                Fechar
                                            </v-btn>
                                            <v-btn tile outlined color="primary"
                                                   @click.prevent="salvarEquipes">
                                                Salvar
                                            </v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>


                            </v-toolbar>
                        </template>

                        <template v-slot:item.action="{ item }">
                            <v-btn class="ma-1" tile outlined small
                            <v-btn class="ma-1" tile outlined small
                                   color="primary" @click="setEquipe(item)"
                            >
                                <v-icon>mdi-account-group</v-icon>
                            </v-btn>

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
            nome: '',
            equipesSelecionadas: [],
            respondedorSelecionado: [],

            campoObrigadorio: [v => !!v || "Campo obrigatório"],
            auxiliares: [],
            headers: [
                {
                    text: 'Nome',
                    align: 'left',
                    value: 'nome',
                },
                {text: 'Codigo de Acesso', value: 'cod_acesso'},
                {text: 'Ações', value: 'action', sortable: false},

            ],
        }),
        methods: {
            salvarRespondedor() {
                if (this.$refs.cadastroAuxiliar.validate()) {

                    this.Helper.setLoadingAtivo();

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
                            this.Helper.setLoadingAtivo(false);
                            this.Helper.exibirMensagem("Respondedor cadastrado com sucesso!", 'success', 3000);
                            this.$apollo.queries.getRespondedores.refetch();
                            this.$refs.cadastroAuxiliar.reset();
                        })
                        .catch(e => {
                            this.Helper.setLoadingAtivo(false);
                            const msg = e.graphQLErrors[0].message || "Ocorreu um erro. Tente novamente.";
                            this.Helper.exibirMensagem(msg, 'error', 3000);
                        });
                }
            },
            limiter(e) {
                if (e.length > 2) {
                    e.pop()
                }
            },
            salvarEquipes() {
                this.dialogSetEquipe = false;
                // if (this.$refs.cadastroAuxiliar.validate()) {
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
                        variables: {
                            dados: {
                                idRespondedor: this.respondedorSelecionado,
                                idsEquipes: this.equipesSelecionadas
                            }
                        }
                    })
                    .then(() => {
                        this.Helper.exibirMensagem("Equipes selecionadas com sucesso!", 'success', 3000);
                        this.$apollo.queries.getRespondedores.refetch();
                        // this.$refs.cadastroAuxiliar.reset()
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
                this.auxiliares.forEach(respondedor => {
                    respondedor.equipes.forEach(equipe => {
                        equipesRespondedores.push(equipe.id);
                    });
                });

                return this.equipes.filter(equipe => {
                    return !equipesRespondedores.includes(equipe.id) || this.equipesSelecionadas.includes(equipe.id);
                });

            }
        },

        watch: {
            dialog(val) {
                val || this.close()
            },
        },

        apollo: {
            getRespondedores: {
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
                    this.auxiliares = res.data.getRespondedores || [];
                }
            },
            getEquipes: {
                query: gql`
          query getEquipes {
              getEquipes{
              id
              nome
            }
          }
        `,
                result(res) {
                    this.equipes = res.data.getEquipes || [];
                }
            }
        }
    }
</script>
