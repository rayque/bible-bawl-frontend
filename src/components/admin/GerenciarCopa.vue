<template>
    <div>
        <Header titulo="Gerenciar Copa"/>

            <v-row>
                <v-col cols="12">
                    <painel-perguntas></painel-perguntas>
                </v-col>
            </v-row>
    </div>

</template>
<script>
    import Header from "./../layouts/Header"
    import PainelPerguntas from "./../Pergunta/PainelPerguntas"

    export default {
        components: {
            Header,
            PainelPerguntas
        },
    }
</script>
