<template>
  <v-container>
    <v-row class="text-center">

      <v-col>
        <v-icon :color="iconColorSys" size="150" >{{ iconSys }}</v-icon>
      </v-col>

      <v-col md="12" sm="12" xs="12">
        <h1 class="display-2 font-weight-bold mb-3">
          {{ nomeSys }}
        </h1>
        <h1>
         Bem-vindo
        </h1>
      </v-col>

    </v-row>
  </v-container>
</template>

<script>
    export  default {
        computed:{

          nomeSys() {
            return process.env.VUE_APP_SYS_NOME;
          },

          iconSys() {
            return process.env.VUE_APP_SYS_ICON;
          },

          colorSys() {
            return process.env.VUE_APP_SYS_COLOR;
          },

          darkSys() {
            return process.env.VUE_APP_SYS_DARK === "true";
          },

          iconColorSys() {
            return process.env.VUE_APP_SYS_ICON_COLOR;
          },


        }
    }
</script>
