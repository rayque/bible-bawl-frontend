<template>
    <div>
        <v-row
                justify="center"
        >
            <v-col
                    cols="12"
                    sm="6"
                    md="4"
            >
                <v-card class="elevation-12 mb-4" tile  >
                    <v-card-text>
                        <h1 class="text-center font-weight-bold head">
                            <v-icon color="orange">mdi-trophy-outline mdi-36px</v-icon>
                            System
                        </h1>
                    </v-card-text>
                </v-card>
                <v-card class="elevation-12" tile >
                    <v-toolbar

                            color="primary"
                            dark
                            flat
                    >
                        <v-toolbar-title>Login</v-toolbar-title>
                        <v-spacer/>

                    </v-toolbar>
                    <v-card-text>
                        <v-form>

                            <p  class="mb-0 text-center font-weight-bold subtitle-1 ">
                                 <span class="elevation-3  pl-6 pr-6 pt-2 pb-1 ">Administrador</span>
                            </p>

                            <v-text-field
                                    class="mt-3 mb-0"
                                    label="Email"
                                    name="email"
                                    prepend-icon="mdi-email-outline"
                                    type="email"
                                    v-model="email"
                                    :disabled="cod_acesso ? true : false"
                            />

                            <v-text-field
                                    class="mt-0 mb-0"
                                    id="password"
                                    label="Senha"
                                    name="password"
                                    prepend-icon="mdi-lock-outline"
                                    type="password"
                                    v-model="password"
                                    :disabled="cod_acesso ? true : false"
                            />

                            <p class="mt-0 mb-0  text-center font-weight-bold subtitle-1">
                                <span class="elevation-3 pl-12 pr-12 pt-2 pb-1">Auxiliar</span>
                            </p>

                            <v-text-field
                                    class="mt-3 mb-0"
                                    id="cod_acesso"
                                    label="Código de acesso"
                                    name="cod_acesso"
                                    prepend-icon="mdi-numeric"
                                    type="number"
                                    v-model="cod_acesso"
                                    :disabled="password || email ? true : false"
                            />

                        </v-form>
                    </v-card-text>

                    <v-card-actions class="mt-0 mb-0">
                        <v-btn  outlined tile color="grey darken-1" @click="limparCampos">Limpar campos</v-btn>
                        <v-spacer/>
                        <v-btn color="primary" outlined tile  @click="login">Entrar</v-btn>
                    </v-card-actions>

                </v-card>
            </v-col>
        </v-row>
    </div>

</template>

<script>
    import {mapActions, mapGetters} from "vuex";
    import gql from "graphql-tag";

    export default {
        data: () => ({
            logged: null,
            // email: null,
            // password: null,
            email: 'rayque@email.com',
            password: 'bacon',
            cod_acesso: null,
            dados: null,
            isAuth: false,
            overlay: false,
        }),
        mounted() {
            if (localStorage.token) {
                this.isAuth = true;
                this.setAuth(localStorage.token);
                this.setLogin(localStorage.token);
            }
        },


        methods: {
            ...mapActions(['setAuth']),
            login() {
                if (this.cod_acesso) {
                    this.dados = {cod_acesso: this.cod_acesso};
                } else {
                    this.dados = {
                        email: this.email,
                        password: this.password,
                    };
                }


                this.Helper.setLoadingAtivo();
                this.$apollo.queries.login.refetch();
            },

            setLogin(token) {
                this.setAuth(token);
                this.$router.push({name: 'equipes'});
                // location.reload();
            },

            limparCampos() {
                this.email =  null;
                this.password =  null;
                this.cod_acesso =  null;
            }
        },
        watch: {
            cod_acesso(val) {
                if (val) {
                    this.email = null;
                    this.password = null;
                }
            },
            email(val) {
                if (val) {
                    this.cod_acesso = null;
                }
            },
            password(val) {
                if (val) {
                    this.cod_acesso = null;
                }
            },

        },
        computed: {
            ...mapGetters({
                getNomeUser: 'getNomeUser',
                getToken: 'getToken'
            })
        },
        apollo: {
            login: {
                query: gql`
                  query login(
                    $dados: AuthInput!
                  ) {
                    login(
                      dados: $dados
                    ) {
                        token
                        tokenExpiration
                    }
                  }
                `,
                variables() {
                    return {
                        dados: this.dados
                    };
                },
                skip() {
                    return !this.dados;
                },
                result(res) {
                    const login = res.data && res.data.login || null;
                    if (login) {
                        this.setLogin(login.token);

                        this.email = null;
                        this.password = null;
                        this.cod_acesso = null;
                    }
                    this.Helper.setLoadingAtivo(false);
                },
                error(e) {
                    this.Helper.setLoadingAtivo(false);
                    this.Helper.exibirMensagem(e.message, 'error', 3000);
                }
            }

        }

    }
</script>
