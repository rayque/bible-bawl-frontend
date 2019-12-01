<template>
  <v-container fluid >
    <v-row>
      <v-col
        cols="12"
      >
        <v-card
          class="pa-2"
          outlined
          tile
        >
          <h2>{{titulo}}</h2>
          <h4>{{subTitulo}}</h4>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    props: {
      titulo: {
        required: true,
      },
      subTitulo: {
        required: false,
      }
    }
  }
</script>

<style scoped>

</style>
