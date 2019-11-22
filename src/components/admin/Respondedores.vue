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
                  <v-row>
                    <v-col cols="12">
                      <v-text-field label="Nome completo *" required></v-text-field>
                    </v-col>
                  </v-row>
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
  export default {
    components: {
      Header
    },
    data: () => ({
      dialog: false,
      nome: '',
    }),
    methods: {
      salvarRespondedor() {
        
      }
    }
  }
</script>
