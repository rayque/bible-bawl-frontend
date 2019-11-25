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
  import moment from 'moment'
  export default {
    directives: {mask},
    components: {
      Header
    },
    data: () => ({
      dialog: false,
      nome: '',
      dtNascimento: '',
      respondedores: [],
      novaEquipe: [],
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
        return await  Object.values(this.novaEquipe).map(participante => {
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
              this.$apollo.queries.getRespondedores.refetch();
              this.$refs.formCadEquipes.reset()
            })
            .catch(e => {
              const msg = e.graphQLErrors[0].message || "Ocorreu um erro. Tente novamente.";
              this.Helper.exibirMensagem(msg, 'error', 3000);
            });

        }
      }
    },
    computed: {
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
