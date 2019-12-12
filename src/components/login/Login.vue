<template>
    <div>
        <Header titulo="Administrar Respondedores"/>

        <v-container fluid class="grey lighten-5">
            <v-row>
                <v-col>


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
