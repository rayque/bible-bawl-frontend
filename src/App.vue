<template>
    <div>
        <div v-if="!isAuth">

            <v-app id="inspire">

                <snack-bar></snack-bar>

                <v-content>
                    <v-container
                            fluid
                    >
                        <v-row
                                justify="center"
                        >
                            <v-col
                                    cols="12"
                                    sm="6"
                                    md="4"
                            >
                                <v-card class="elevation-12 mb-4">
                                    <v-card-text>
                                        <h1 class="text-center font-weight-bold head">
                                            <v-icon color="orange">mdi-trophy mdi-36px </v-icon>
                                            Bible Bawl
                                            <v-icon color="orange">mdi-trophy mdi-36px </v-icon>
                                        </h1>
                                    </v-card-text>
                                </v-card>
                                <v-card class="elevation-12">
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

                                            <p class="mb-0 text-center font-weight-bold subtitle-1 elevation-3">Administrador</p>

                                            <v-text-field
                                                    class="mt-0 mb-0"
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

                                            <p class="mt-0 mb-0  text-center font-weight-bold subtitle-1 elevation-3">Auxiliar</p>


                                            <v-text-field
                                                    class="mt-0 mb-0"
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
                                        <v-spacer/>
                                        <v-btn color="primary" @click="login">Enviar</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-content>
            </v-app>

        </div>
        <div v-if="isAuth">

            <v-app id="inspire">


                <snack-bar></snack-bar>
                <v-navigation-drawer
                        v-model="drawer"
                        app
                >
                    <v-list dense>
                        <v-list-item v-if="$acl.check('isLogged')" link to="/">
                            <v-list-item-action>
                                <v-icon>mdi-home</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>HOME</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>


                        <v-list-item v-if="$acl.check('isAdmin')" link :to="{name: 'GerenciarCopa'}">
                            <v-list-item-action>
                                <v-icon>mdi-clipboard-multiple-outline</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>Gerenciar Copa</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>


                        <v-list-item v-if="$acl.check('isAdmin')" link :to="{name: 'resultados'}">
                            <v-list-item-action>
                                <v-icon>mdi-podium</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>Resultados</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>


                        <v-list-item v-if="$acl.check('isLogged')" link :to="{name: 'painel'}">
                            <v-list-item-action>
                                <v-icon>mdi-view-dashboard</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>Painel</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>

                        <v-list-item v-if="$acl.check('isAdmin')" link :to="{name: 'auxiliares'}">
                            <v-list-item-action>
                                <v-icon>mdi-cellphone-nfc</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>Auxiliares</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>


                        <v-list-item v-if="$acl.check('isLogged')" link :to="{name: 'equipes'}">
                            <v-list-item-action>
                                <v-icon>mdi-account-group</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>Equipes</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>

                        <v-list-item v-if="$acl.check('isLogged')" link :to="{name: 'copa'}">
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
                        color="blue darken-4"
                        dark
                >

                    <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
                    <v-toolbar-title>
                        <v-icon color="orange">mdi-trophy</v-icon>
                        Bible Bawl
                    </v-toolbar-title>
                    <v-spacer></v-spacer>

                    <!--                    {{ $acl.get }}-->

                    <!--                    <v-toolbar-items>-->
                    <!--                        <v-btn text>{{ getNomeUser }}</v-btn>-->
                    <!--                    </v-toolbar-items>-->

                    <v-btn icon @click="setAuth('')">
                        <v-icon>mdi-logout</v-icon>
                    </v-btn>

                </v-app-bar>

                <v-content class="grey lighten-3">

                    <v-container>
                        <router-view/>
                    </v-container>
                </v-content>
                <v-footer color="blue darken-4" app>
                    <span class="white--text">&copy; 2019</span>
                </v-footer>
            </v-app>
        </div>


    </div>
</template>

<script>
    import SnackBar from "./components/utils/SnackBar"
    import {mapActions, mapGetters} from "vuex";
    import gql from "graphql-tag";
    import jwt from "jsonwebtoken";

    export default {
        components: {
            SnackBar
        },
        props: {
            source: String,
        },
        data: () => ({
            drawer: null,
            logged: null,
            email: null,
            password: null,
            cod_acesso: null,
            dados: null,
            isAuth: false,
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

                this.$apollo.queries.login.refetch();
            },

            setLogin(token) {
                this.setAuth(token);
                const dados = jwt.decode(token);
                let permissao = dados ? dados.permissao : 'public';
                this.$acl.change(permissao);
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
            getToken(val) {
                this.isAuth = !!val;
            }
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
                },
                error(e) {
                    this.Helper.exibirMensagem(e.message, 'error', 3000);
                }
            }

        }

    }
</script>
