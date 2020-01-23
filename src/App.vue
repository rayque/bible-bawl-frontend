<template>
    <div>
        <v-app id="inspire">

            <snack-bar></snack-bar>

            <div v-if="$acl.check('isLogged')">


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
                                <v-icon>mdi-podium</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>Resultados
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>


                        <v-list-item v-if="$acl.check('isLogged')" link
                                     :to="{name: 'painel'}">
                            <v-list-item-action>
                                <v-icon>mdi-view-dashboard</v-icon>
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


                        <v-list-item v-if="$acl.check('isLogged')" link
                                     :to="{name: 'equipes'}">
                            <v-list-item-action>
                                <v-icon>mdi-account-group</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>Equipes</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>

                        <v-list-item v-if="$acl.check('isLogged')" link
                                     :to="{name: 'copa'}">
                            <v-list-item-action>
                                <v-icon>mdi-account-multiple-check</v-icon>
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
            >

                <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
                <v-toolbar-title>
<!--                                            <v-icon color="orange">mdi-trophy</v-icon>-->
                    System
                </v-toolbar-title>
                <v-spacer></v-spacer>

                                    {{ $acl.get }}
                                    {{ getAuth.nome }}

<!--                                    <v-toolbar-items>-->
<!--                                        <v-btn text>{{ getNomeUser }}</v-btn>-->
<!--                                    </v-toolbar-items>-->

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
    import {mapActions, mapGetters} from "vuex";
    import jwt from "jsonwebtoken";

    export default {
        components: {
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
            ...mapGetters(['getAuth'])
        }
    }
</script>
