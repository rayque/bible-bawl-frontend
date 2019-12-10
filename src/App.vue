<template>
  <v-app id="inspire" >

    <snack-bar></snack-bar>

    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <v-list dense>
        <v-list-item link to="/">
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>HOME</v-list-item-title>
          </v-list-item-content>
        </v-list-item>


        <v-list-item link :to="{name: 'GerenciarCopa'}">
          <v-list-item-action>
            <v-icon>mdi-clipboard-multiple-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Gerenciar Copa</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link :to="{name: 'respondedores'}">
          <v-list-item-action>
            <v-icon>mdi-cellphone-nfc</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Respondedores</v-list-item-title>
          </v-list-item-content>
        </v-list-item>


        <v-list-item link :to="{name: 'equipes'}">
          <v-list-item-action>
            <v-icon>mdi-account-group</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Equipes</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link :to="{name: 'copa'}">
          <v-list-item-action>
            <v-icon>mdi-account-multiple-check</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Responder Perguntas</v-list-item-title>
          </v-list-item-content>
        </v-list-item>


      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      color="indigo"
      dark
    >

      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Sys</v-toolbar-title>
    </v-app-bar>

    <v-content class="grey lighten-3">

      <v-container>
        <router-view/>
      </v-container>
    </v-content>
    <v-footer
      color="indigo"
      app
    >
      <span class="white--text">&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
  import SnackBar from "./components/utils/SnackBar"
  export default {
    components: {
      SnackBar
    },
    props: {
      source: String,
    },
    data: () => ({
      drawer: null,
    }),
  }
</script>
