<template>
    <v-overlay :value="getLoading.ativo">
        <v-progress-circular
                :size="64"
                color="primary"
                indeterminate
        ></v-progress-circular>
    </v-overlay>
</template>

<script>
    import {mapGetters} from 'vuex';

    export default {
        computed: {
            ...mapGetters({
                getLoading: 'getLoading'
            }),
        },
    }
</script>

