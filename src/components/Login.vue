<template>
    <v-container fluid class="fill-height">
        <v-row align="center" justify="center">
            <v-flex xs3>                
                <v-alert
                    v-model="alert"
                    text
                    prominent
                    dense
                    transition="scale-transition"
                    type="error" 
                    icon="vpn_key"
                    >
                    {{ message }}
                </v-alert>

                <v-card class="elevation-8" color="#10163a">
                    <br>
                    <v-img
                        id="logoEntel"
                        align="right"
                        :src="logo"
                        width="120"
                        height="110"
                    />
                    <br><p align="center" class="headline" style="color:#005BFF">Operador Automático de Redes</p>
                    <br><br>
                    <v-card-text>
                        <v-text-field
                            v-model="dataLogin.user"
                            solo
                            rounded
                            color="#898A9C"
                            append-icon="person"
                            label="Usuario" 
                            >
                        </v-text-field>
                        <v-text-field
                            v-model="dataLogin.pass"
                            @keypress.enter="login()"
                            solo
                            rounded
                            color="#898A9C"
                            label="Contraseña"
                            @click:append="show = !show"
                            :append-icon="show ? 'visibility_off' : 'visibility'"
                            :type="show ? 'text' : 'password'"
                            >
                        </v-text-field>
                        <v-checkbox
                            style="color: #898A9C"
                            v-model="remember"
                            color="#898A9C"
                            label="¿Recordar credenciales?">
                        </v-checkbox>
                        <v-btn
                            @click="login()"
                            :loading="loading"
                            rounded
                            large
                            dark
                            color="#005BFF"
                            block>
                            Ingresar
                        </v-btn>
                        <br>
                        <v-btn
                            @click="loading = false; clearData()"
                            rounded
                            large
                            dark
                            color="#FF3D00"
                            block>
                            Otro Usuario
                        </v-btn>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-row>
    </v-container>
</template>

<script>
    export default {
        data: () =>({
            logo: require('../assets/logo-login.png'),
            remember: true,
            loading: false,
            alert: false,
            show: false,
            dataLogin: {
                user: '',
                pass: ''
            },
            message: null
        }),
        methods:{
            login(){
                this.loading = true;
                
                if(this.dataLogin.user !== '' || this.dataLogin.pass !== ''){
                    if(this.dataLogin.user == 'admin' && this.dataLogin.pass == 'admin'){//Gwd@?nHk3_aWSmGNx^*t7Z4
                        this.loading = false;
                        this.$router.push('/dashboard')
                        this.alert = false;
                    }else{
                        this.loading = false;
                        this.alert = true;
                        this.message = 'Auth error, try again.';
                    }
                }else{
                    this.loading = false;
                    this.alert = true;
                    this.message = "Login Failed. Can't be blank fields";
                }
            },
            clearData(){
                this.dataLogin.user = '';
                this.dataLogin.pass = '';
            }
        }
    }
</script>

<style scoped>
    #logoEntel{
        display: block;
        margin-left: auto;
        margin-right: auto;
    }
</style>