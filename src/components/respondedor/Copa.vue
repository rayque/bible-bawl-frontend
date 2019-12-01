<template>
  <div >
    <Header titulo="Copa"/>

    <v-container fluid>
        <v-row  no-gutters  >
        <v-col  :cols="equipes/12" v-for="(equipe, indexEquipe) in equipes" :key="indexEquipe">

            <v-card  flat class="text-center white--text">
                <v-dialog
                v-model="dialog"
                width="500"
                >
                    <template v-slot:activator="{ on }">
                        <v-btn
                        depressed
                        class="mt-2 title grey--text"
                        v-on="on"
                        >
                            Equipe {{equipe.id}}
                        </v-btn>
                    </template>

                    <v-card>
                        <v-card-title
                        class="headline grey lighten-2"
                        primary-title
                        >
                            Informações da equipe
                        </v-card-title>

                        <v-card-text>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </v-card-text>

                        <v-divider></v-divider>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                color="primary"
                                text
                                @click="dialog = false"
                            >
                                fechar
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>

                <v-row no-gutters>
                    <v-col cols="12" class="text-center" 
                    v-for="(participante, indexParticipante) in equipe.participantes" :key="indexParticipante">

                        <!-- <v-btn text class="mt-3 mb-3" @click="salvarRespota(participante)"  elevation="6" icon color="grey lighten-1"> -->
                            <!-- <v-icon>mdi-account</v-icon> -->
                            <v-btn
                                :loading="loading5"
                                :disabled="loading5"
                                color="grey lighten-1"
                                class="mt-3 mb-3"
                                icon
                                elevation="6"
                                @click="loader = 'loading5'"
                            >
                                <v-icon dark>mdi-account</v-icon>
                            </v-btn>
                                                    
                        <!-- </v-btn> -->

                    </v-col>
                </v-row>

            </v-card>

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
        result: null,
        dialog: false,
        equipes: [],
        loader: null,
        loading5: false,
    }),
    methods: {
        salvarRespota(participante) {
            /* eslint-disable no-console */
            console.log(participante.nome);
        }    
    },

    watch: {
      loader () {
        const l = this.loader
        this[l] = !this[l]

        setTimeout(() => (this[l] = false), 3000)

        this.loader = null
      },
    },
    apollo: {
      // They key is the name of the data property
      // on the component that you intend to populate.
      getRespondedor: {
        // Yes, this looks confusing.
        // It's just normal GraphQL.
        query: gql`
          query getRespondedor {
            getRespondedor(id: 1){
                id
                nome
                cod_acesso
                equipes {
                    id
                    nome
                    categoria {
                        id 
                        nome
                        descricao
                    }
                    participantes {
                        id
                        nome
                    }
                }
            }
          }
        `,
        result(res) {

            
            /* eslint-disable no-console */
            console.log(res.data.getRespondedor);
            /* eslint-enable no-console */
            this.respondedor = res.data.getRespondedor || [];
            this.equipes = this.respondedor.equipes || [];
        },
        catch() {
        this.Helper.exibirMensagem("error", 'error', 3000);    
        }
        
      }
    }
  }
</script>
<style scoped>
.equipe-0{
  /* background-color: #FFA726; */
  background-color: #FFE0B2;
}
.equipe-1{
  /* background-color: #78909C; */
  background-color: #CFD8DC;
}
.equipe-2{
  /* background-color: #8D6E63; */
  background-color: #D7CCC8;
}
.equipe-title-0{
  background-color: #FF9800;
}
.equipe-title-1{
  background-color: #607D8B;
}
.equipe-title-2{
  background-color: #795548;
}

  .custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }
  @-moz-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-o-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
