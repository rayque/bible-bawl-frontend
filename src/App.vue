<template>
    <div>
        <v-app id="inspire">

            <snack-bar></snack-bar>
            <loading></loading>

            <div v-if="$acl.check('isLogged')">


                <v-navigation-drawer
                        v-model="drawer"
                        app
                        :dark="darkSys"
                >
                    <v-list dense  class="primary--text">

                        <div class="pa-2">

                            <div class="grey--text text--darken-4">
                                <v-icon>mdi-account-outline</v-icon>
                                {{ getAuth.nome }}
                                <p class="ml-7 overline"  >
                                    {{ $acl.get }}
                                </p>
                            </div>

                        </div>

                        <v-list-item v-if="$acl.check('isLogged')" link to="/">
                            <v-list-item-action>
                                <v-icon>mdi-home-outline</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>HOME</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>


                        <v-list-item v-if="$acl.check('isAdmin')" link
                                     :to="{name: 'GerenciarCopa'}">
                            <v-list-item-action>
                                <v-icon>mdi-clipboard-multiple-outline</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>Gerenciar Copa
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>


                        <v-list-item v-if="$acl.check('isAdmin')" link
                                     :to="{name: 'resultados'}">
                            <v-list-item-action>
                                <v-icon> {{ iconSys }} </v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>Resultados
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>


                        <v-list-item link v-if="$acl.check('isAdmin')"
                                     :to="{name: 'painel'}">
                            <v-list-item-action>
                                <v-icon>mdi-view-dashboard-outline</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>Painel</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>

                        <v-list-item v-if="$acl.check('isAdmin')" link
                                     :to="{name: 'auxiliares'}">
                            <v-list-item-action>
                                <v-icon>mdi-cellphone-nfc</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>Auxiliares
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>


                        <v-list-item link v-if="$acl.check('isLogged')"
                                     :to="{name: 'equipes'}">
                            <v-list-item-action>
                                <v-icon>mdi-account-group</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>Equipes</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>

                        <v-list-item  link v-if="$acl.check('isLogged')"
                                     :to="{name: 'copa'}">
                            <v-list-item-action>
                                <v-icon>mdi-account-multiple-check-outline</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>Responder Perguntas
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>


                    </v-list>
                </v-navigation-drawer>
            </div>


            <v-app-bar
                    v-if="$acl.check('isLogged')"
                    app
                    :color="colorSys"
                    :dark="darkSys"
            >
                <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
                <v-icon :color="iconColorSys" class="mx-4">{{ iconSys }}</v-icon>
                <v-toolbar-title class="mr-12 align-center">
                    <span class="title">{{ nomeSys }}</span>
                </v-toolbar-title>

                <v-spacer></v-spacer>

                <v-btn icon @click="logout()">
                    <v-icon>mdi-logout</v-icon>
                </v-btn>

            </v-app-bar>

            <v-content class="grey lighten-3">

                <v-container>
                    <router-view/>
                </v-container>
            </v-content>
            <!--                <v-footer color="blue darken-4" app>-->
            <!--                    <span class="white&#45;&#45;text">&copy; 2019</span>-->
            <!--                </v-footer>-->
        </v-app>
    </div>


</template>

<script>
    import SnackBar from "./components/utils/SnackBar"
    import Loading from "./components/utils/Loading";
    import {mapActions, mapGetters} from "vuex";
    import jwt from "jsonwebtoken";

    export default {
        components: {
            Loading,
            SnackBar
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
            this.Helper.setLoadingAtivo(false);
        },
        methods: {
            ...mapActions(['setAuth']),

            setLogin(token) {
                this.setAuth(token);
                const dados = jwt.decode(token);
                let permissao = dados ? dados.permissao : 'public';
                this.$acl.change(permissao);
            },

            logout() {
                this.setAuth('');
                this.$router.push({name: 'login'});
            }
        },
        computed: {
            ...mapGetters(['getAuth']),

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
