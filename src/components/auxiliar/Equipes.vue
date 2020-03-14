<template>
    <div>
        <Header titulo="Administrar Equipes"/>
        <v-row>
            <v-col cols="12">

                <v-data-table
                        :headers="headers"
                        :items="listaEquipes"
                        sort-by="calories"
                        class="elevation-1"
                        :loading="$apollo.queries.getEquipes.loading"
                        loading-text="Carregando.. por favor aguarde"
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
                            <v-dialog v-model="dialog"
                                      max-width="600px">
                                <template v-slot:activator="{ on }">
                                    <v-btn color="primary"  v-on="on"
                                           outlined tile
                                           title="Cadastrar Equipe"
                                    >
                                        <v-icon>mdi-plus-box-multiple-outline</v-icon>
                                    </v-btn>
                                </template>
                                <v-card>
                                    <v-card-title>
                                        <span class="headline">{{ formTitle }}</span>
                                    </v-card-title>
                                    <v-card-text>

                                        <v-alert
                                                dense
                                                border="left"
                                                type="warning"
                                                v-if="perguntaAtual"
                                        >
                                            A competição já iniciou, portanto,
                                            os pontos do participante que for
                                            editado <strong> não contará
                                            para a classificação individual(Não
                                            receberá premiação
                                            individual).</strong> A pontuaçãodo
                                            participante editado valerá somente
                                            para classificação da equipe.
                                        </v-alert>


                                        <v-container>
                                            <v-form ref="formCadEquipes">

                                                <v-row>
                                                    <v-col cols="12">
                                                        <div
                                                                v-for="n in 4"
                                                                :key="n">

                                                            <div class="mb-2 pa-2">

                                                                <h3 class="text-center elevation-3">
                                                                    Participante
                                                                    {{ n }}</h3>

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
                                        <v-btn color="grey darken-1" outlined tile
                                               @click="dialog = false">Fechar
                                        </v-btn>
                                        <v-btn color="primary" outlined tile
                                               v-if="editedIndex === -1"
                                               @click.prevent="salvarEquipe">
                                            Salvar
                                        </v-btn>
                                        <v-btn color="primary" outlined tile
                                               v-if="editedIndex !== -1"
                                               @click.prevent="salvarEdicao">
                                            Salvar Edição
                                        </v-btn>

                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-toolbar>
                    </template>

                    <template v-slot:item.action="{ item }">

                        <v-btn class="ma-1" color="primary"  tile outlined
                                @click="editItem(item)"
                        >
                            <v-icon>mdi-pencil-outline</v-icon>
                        </v-btn>

                        <v-btn class="ma-1" color="red" tile outlined
                               @click="showModalDeleteItem(item)"
                        >
                            <v-icon>mdi-delete-forever-outline</v-icon>
                        </v-btn>
                    </template>

                </v-data-table>

                <v-dialog v-model="dialogDelete" max-width="290">
                    <v-card>
                        <v-card-title class="body-1">Tem certeza que deseja exluir a equipe?</v-card-title>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="grey darken-1" tile outlined
                                   @click="dialogDelete=false"
                            >
                                Não
                            </v-btn>
                            <v-btn color="red darken-1" tile outlined
                                   @click="deleteItem">
                                Sim
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>

            </v-col>
        </v-row>
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
            dialogDelete: false,
            deleteEquipeId : null,
            novaEquipe: [],
            perguntaAtual: null,
            headers: [
                {
                    text: 'Equipe',
                    align: 'left',
                    value: 'nome',
                },
                {text: 'Categoria', value: 'categoria'},
                {text: 'Ações', value: 'action', sortable: false},
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
                for (let n = 0; n < 4; n += 1) {
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


                    this.Helper.setLoadingAtivo();

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
                            this.Helper.setLoadingAtivo(false);
                            this.Helper.exibirMensagem("Equipe cadastrada com sucesso!", 'success', 3000);
                            this.$apollo.queries.getEquipes.refetch();
                            this.$refs.formCadEquipes.reset();
                        })
                        .catch(e => {
                            this.Helper.setLoadingAtivo(false);
                            const msg = e.graphQLErrors[0].message || "Ocorreu um erro. Tente novamente.";
                            this.Helper.exibirMensagem(msg, 'error', 3000);
                        });

                }
            },

            async salvarEdicao() {
                if (this.$refs.formCadEquipes.validate()) {

                    let dados = await this.formatarDataNascimento();
                    dados = dados.map(participante => {
                        return {
                            id: participante.id,
                            nome: participante.nome,
                            data_nascimento: participante.data_nascimento,
                        }
                    });

                    this.Helper.setLoadingAtivo();

                    this.$apollo
                        .mutate({
                            mutation: gql`
                            mutation ($participantes: [EditarParticipanteInput!]!) {
                              setEditarEquipe(participantes: $participantes)
                            }
                        `,
                            variables: {participantes: dados}
                        })
                        .then(() => {
                            this.Helper.setLoadingAtivo(false);
                            this.Helper.exibirMensagem("Equipe editada com sucesso!", 'success', 3000);
                            this.$apollo.queries.getEquipes.refetch();
                            this.dialog = false;
                        })
                        .catch(e => {
                            this.Helper.setLoadingAtivo(false);
                            const msg = e.graphQLErrors[0].message || "Ocorreu um erro. Tente novamente.";
                            this.Helper.exibirMensagem(msg, 'error', 3000);
                        });
                }
            },

            editItem(item) {
                this.editedIndex = this.listaEquipes.indexOf(item)
                this.novaEquipe = Object.assign({}, item.participantes);

                this.dialog = true
            },

            showModalDeleteItem(equipe){
                this.dialogDelete = true;
                this.deleteEquipeId = equipe.id;
            },

            deleteItem() {
                this.Helper.setLoadingAtivo();
                this.$apollo
                    .mutate({
                        mutation: gql`
                            mutation ($equipe_id: Int!) {
                              excluirEquipe(equipe_id: $equipe_id)
                            }
                        `,
                        variables: {equipe_id: this.deleteEquipeId}
                    })
                    .then(() => {
                        this.Helper.setLoadingAtivo(false);
                        this.Helper.exibirMensagem("Equipe excluida com sucesso!", 'success', 3000);
                        this.$apollo.queries.getEquipes.refetch();
                        this.dialogDelete = false;
                    })
                    .catch(e => {
                        this.Helper.setLoadingAtivo(false);
                        const msg = e.graphQLErrors[0].message || "Ocorreu um erro. Tente novamente.";
                        this.Helper.exibirMensagem(msg, 'error', 3000);
                    });
            },

            close() {
                if (!this.dialog) {
                    this.$refs.formCadEquipes.reset();
                    this.novaEquipe = this.setEquipe();
                    this.editedIndex = -1
                }
            }

        },
        watch: {
            dialog(val) {
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

                    const participantes = equipe.participantes.map(participante => {

                        const data_nascimento = moment(participante.data_nascimento, 'YYYY-MM-DD').format('DD/MM/YYYY');
                        return {
                            ...participante,
                            data_nascimento,
                        }
                    });

                    return {
                        id: equipe.id,
                        nome: equipe.nome,
                        categoria: categoria,
                        participantes
                    }
                })
            },
            formTitle() {
                return this.editedIndex === -1 ? 'Nova Equipe' : 'Editar Equipe'
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
            getEquipes: {
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
                    this.equipes = res.data.getEquipes || [];
                }
            },

            getPerguntaAtual: {
                query: gql`
                  query getPerguntaAtual {
                    getPerguntaAtual{
                        id
                        pergunta_atual
                        status {
                          id
                          nome
                          descricao
                        }
                    }
                  }
                `,
                result(res) {
                    this.perguntaAtual = res.data.getPerguntaAtual;
                },
                catch() {
                    this.Helper.exibirMensagem("error", 'error', 3000);
                }

            },
            $subscribe: {
                novaPerguntaAtual: {
                    query: gql`
                    subscription {
                      novaPerguntaAtual {
                        id
                        status {
                          id
                          nome
                          descricao
                        }
                      }
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
