<template>
    <v-container fluid grid-list-md text-xs-left>
        <v-layout row wrap align-center justify-center>
            <v-flex xs9 mt-11>
                <v-card>
                    <v-toolbar color="#005BFF" dark>
                        <v-toolbar-title class="headline">
                            <v-icon>public</v-icon> Nodos
                        </v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-flex xs3>
                            <v-text-field
                                v-model="search"
                                append-icon="search"
                                color="#FF3D00"
                                solo-inverted
                                hide-details>

                            </v-text-field>
                        </v-flex>
                        <v-spacer></v-spacer>

                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn
                                    @click="dialogRemove = true"
                                    v-on="on"
                                    :disabled="selected[0] === undefined"
                                    icon>
                                    <v-icon>delete</v-icon>
                                </v-btn>
                            </template>
                            <span>Eliminar Nodos</span>
                        </v-tooltip>

                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn
                                    @click="sendDataToEdit()"
                                    :disabled="selected[0] === undefined"
                                    v-on="on" 
                                    icon>
                                    <v-icon>edit</v-icon>
                                </v-btn>
                            </template>
                            <span>Editar Nodos</span>
                        </v-tooltip>

                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn
                                    v-on="on" 
                                    icon 
                                    @click="dialogAdd = true">
                                    <v-icon>add</v-icon>
                                </v-btn>
                            </template>
                            <span>Agregar Nodos</span>
                        </v-tooltip>

                    </v-toolbar>

                    <!--TABLE-->
                    <v-data-table
                        dark
                        v-model="selected"
                        :search="search"
                        show-select
                        single-select
                        item-key="idNodo"
                        :items="items"
                        :headers="headers"
                        :footer-props="{
                            prevIcon: 'arrow_back_ios',
                            nextIcon: 'arrow_forward_ios'
                        }"
                        :loading="loading"
                        loading-text="Cargando registros..."
                        no-data-text="No se encontraron registros."
                        >
                    </v-data-table>
                </v-card>

                <!--DIALOG ADD-->
                <v-dialog v-model="dialogAdd" width="750" persistent>
                    <v-card>
                        <v-card-title class="headline">Agregar</v-card-title>
                            <v-card-text>
                                <v-row>
                                    <v-col cols="12" sm="7">
                                        <v-text-field
                                            v-model="dataNodos.nodo"
                                            label="Nombre">

                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="5">
                                        <v-select
                                            v-model="dataNodos.idTipo"
                                            :items="selectType"
                                            label="Tipo">
                                        </v-select>
                                    </v-col>
                                    <v-col cols="12" sm="5">
                                        <v-select
                                            v-model="dataNodos.idOss"
                                            :items="selectOss"
                                            label="Host">
                                        </v-select>
                                    </v-col>
                                    <v-col cols="12" sm="7">
                                        <v-text-field
                                            v-model="dataNodos.ipv4"
                                            label="IP">
                                        </v-text-field>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                @click="dialogAdd = false; clearFields()"
                                dark
                                color="#FF3D00">
                                Cancelar
                            </v-btn>
                            <v-btn
                                @click="addNodos()"
                                dark
                                color="#005BFF">
                                Agregar
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>

                <!--DIALOG DELETE-->
                <v-dialog v-model="dialogRemove" max-width="450" persistent>
                    <v-card>
                        <v-card-title>
                            <span class="headline">Eliminar</span>
                        </v-card-title>
                        <v-card-text class="body-1" v-if="this.selected[0] !== undefined">
                            ¿Está seguro que desea Eliminar el registro <b>{{ this.selected[0].nodo }}</b> de Nodos?
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer/>
                            <v-btn
                                @click="dialogRemove = false"
                                dark
                                color="#FF3D00"
                                >
                                Cancelar
                            </v-btn>
                            <v-btn
                                @click="deleteNodos()"
                                dark
                                color="#005BFF">
                                Eliminar
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>

                <!--DIALOG EDIT-->
                <v-dialog v-model="dialogEdit" width="750" persistent>
                    <v-card>
                        <v-card-title class="headline">Editar</v-card-title>
                            <v-card-text>
                                <v-row>
                                    <v-col cols="12" sm="7">
                                        <v-text-field
                                            v-model="dataNodos.nodo"
                                            label="Nombre">

                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="5">
                                        <v-select
                                            v-model="dataNodos.idTipo"
                                            :items="selectType"
                                            label="Tipo">
                                        </v-select>
                                    </v-col>
                                    <v-col cols="12" sm="5">
                                        <v-select
                                            v-model="dataNodos.idOss"
                                            value=""
                                            :items="selectOss"
                                            label="Host">
                                        </v-select>
                                    </v-col>
                                    <v-col cols="12" sm="7">
                                        <v-text-field
                                            v-model="dataNodos.ipv4"
                                            label="IP">

                                        </v-text-field>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                @click="dialogEdit = false; clearFields()"
                                dark
                                color="#FF3D00">
                                Cancelar
                            </v-btn>
                            <v-btn
                                @click="editNodos()"
                                dark
                                color="#005BFF">
                                Editar
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>

                <!--SNACKBAR-->
                <v-snackbar v-model="snack" :color="responseClient.color" :style="`color:${responseClient.colorText}`" top :timeout="timeSnack" v-if="this.responseClient.message !== undefined">
                    {{responseClient.message}}
                    <v-spacer/>
                    <v-btn icon @click="snack = false">
                        <v-icon :color="responseClient.colorText">{{responseClient.icon}}</v-icon>
                    </v-btn>
                </v-snackbar>

            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import axios from 'axios';
    import { environments } from '../environments/environments';

    export default {
        name: 'Nodos',
        data:() =>({
            timeSnack: 4000,
            snack: false,
            responseClient :{
                message: '',
                icon: '',
                color: '',
                colorText: ''
            },
            search: '',
            dialogAdd: false,
            dialogRemove: false,
            dialogEdit: false,
            selected: [],
            items: [],
            headers: [
                { text: 'Nombre', value: 'nodo' },
                { text: 'Tipo', value: 'idTipo' },
                { text: 'Host', value: 'idOss' },
                { text: 'IP', value: 'ipv4' }
            ],
            loading: false,
            dataNodos:{
                nodo: '',
                idTipo: '',
                idOss: '',
                ipv4: ''
            },
            selectOss: [],
            selectType: []
        }),
        beforeMount(){
            let self = this;
            self.loading = true;

            async function getDataNodos(){
                try {
                    const getReadNodos = await axios.get(`${environments.API_KPI_MONITOR}/Nodos`)
                    if(getReadNodos)
                        return getReadNodos
                } catch (error) {
                    return error;
                }
            }
            getDataNodos().then((response) =>{
                if(response.status == 200){

                    axios.get(`${environments.API_KPI_MONITOR}/Osses`)
                    .then((responseOss) =>{
                       
                        let toOss = [];  

                        responseOss.data.forEach((value) =>{ 
                            toOss.push({
                                'text': value.oss,
                                'value': value.idOss
                            })
                        })

                        self.selectOss = toOss;

                        axios.get(`${environments.API_KPI_MONITOR}/Tipos`)
                        .then((responseType) =>{
                        
                            let toType = [];

                            responseType.data.forEach((value) =>{
                                toType.push({
                                    'text': value.tipo,
                                    'value': value.idTipo
                                })
                            })

                            self.selectType = toType;
                            
                            const groupByIdOSS = responseOss.data.reduce((acc, data) =>{
                                if(!acc[data.idOss])
                                    acc[data.idOss] = [];

                                acc[data.idOss].push(data);
                                return acc;
                            }, {});

                            const groupByIdType = responseType.data.reduce((acc, data) =>{
                                if(!acc[data.idTipo])
                                    acc[data.idTipo] = [];

                                acc[data.idTipo].push(data);
                                return acc;
                            }, {});

                            let newItemsNodos = [];

                            response.data.forEach((value) =>{
                                newItemsNodos.push({
                                    idNodo: value.idNodo,
                                    nodo: value.nodo,
                                    idTipo: groupByIdType[value.idTipo][0]['tipo'],
                                    idOss: groupByIdOSS[value.idOss][0]['oss'],
                                    ipv4: value.ipv4
                                })
                            })

                            self.items = newItemsNodos;
                            self.loading = false;
                        })
                    })
                }
            })
            .catch((err) => { console.log(`Error al intentar listar data: ${err}`)} );

        },
        methods:{
            async callNodos(){
                await axios.get(`${environments.API_KPI_MONITOR}/Nodos`)
                .then((response) =>{
                    if(response.status == 200){
                        axios.get(`${environments.API_KPI_MONITOR}/Osses`)
                        .then((responseOss) =>{
                            
                            axios.get(`${environments.API_KPI_MONITOR}/Tipos`)
                            .then((responseType) =>{

                                const groupByIdOSS = responseOss.data.reduce((acc, data) =>{
                                    if(!acc[data.idOss])
                                        acc[data.idOss] = [];

                                    acc[data.idOss].push(data);
                                    return acc;
                                }, {});

                                const groupByIdType = responseType.data.reduce((acc, data) =>{
                                    if(!acc[data.idTipo])
                                        acc[data.idTipo] = [];

                                    acc[data.idTipo].push(data);
                                    return acc;
                                }, {});

                                let newItemsNodos = [];

                                response.data.forEach((value) =>{
                                    newItemsNodos.push({
                                        idNodo: value.idNodo,
                                        nodo: value.nodo,
                                        idTipo: groupByIdType[value.idTipo][0]['tipo'],
                                        idOss: groupByIdOSS[value.idOss][0]['oss'],
                                        ipv4: value.ipv4
                                    })
                                })

                                this.items = newItemsNodos;
                                this.loading = false;
                            })
                        })
                    }
                })
                .catch((error) => { console.log(`Error al intentar listar Nodos: ${error}`) });
            },
            async addNodos(){
                await axios.post(`${environments.API_KPI_MONITOR}/Nodos`, this.dataNodos)
                .then((response) =>{
                    if(response.status == 200){
                        this.dialogAdd = false;
                        this.responseClient = {
                            message: 'Nodo Agregado correctamente',
                            icon: 'done_outline',
                            color: '#01E9B2',
                            colorText: '#005BFF'
                        }
                        this.snack = true;
                        this.callNodos();
                        this.clearFields();
                    }
                })
                .catch((error)=>{
                    this.responseClient = {
                        message: `Error al intentar agregar Nodo ${error}`,
                        icon: 'warning',
                        color: '#FF3D00',
                        colorText: '#FFF'
                    }
                    this.snack = true;
                    console.log(`Error al intentar agregar Nodo: ${error}`);
                });
            },
            async deleteNodos(){
                await axios.delete(`${environments.API_KPI_MONITOR}/Nodos/${this.selected[0].idNodo}`)
                .then((response) =>{
                    if(response.status == 200){
                        this.callNodos();
                        this.dialogRemove = false;                        
                        this.responseClient = {
                            message: 'Nodo Eliminado correctamente',
                            icon: 'done_outline',
                            color: '#01E9B2',
                            colorText: '#005BFF'
                        }
                        this.snack = true;
                    }
                })
                .catch((error) =>{
                    this.responseClient = {
                        message: `Error al intentar eliminar Nodo ${error}`,
                        icon: 'warning',
                        color: '#FF3D00',
                        colorText: '#FFF'
                    }
                    this.snack = true;
                    console.error(`Error al intentar eliminar Nodo: ${error}`);
                });
            },
            sendDataToEdit(){
                this.dialogEdit = true;
                Object.assign(this.dataNodos, this.selected[0]);
            },
            async editNodos(){
                await axios.put(`${environments.API_KPI_MONITOR}/Nodos/${this.selected[0].idNodo}`, this.dataNodos)
                .then((response) =>{
                    if(response.status == 200){
                        this.dialogEdit = false;
                        this.responseClient = {
                            message: 'Nodo Editado correctamente',
                            icon: 'check',
                            color: '#01E9B2',
                            colorText: '#005BFF'
                        }
                        this.snack = true;
                        this.callNodos();
                        this.clearFields();
                    }
                })
                .catch((error) => {
                    this.responseClient = {
                        message: `Error al intentar editar Nodo ${error}`,
                        icon: 'warning',
                        color: '#FF3D00',
                        colorText: '#FFF'
                    }
                    this.snack = true;
                    console.log(`Error al intentar editar Nodo ${error}`);
                });
            },
            clearFields(){
                this.dataNodos.nodo = '';
                this.dataNodos.idTipo = '';
                this.dataNodos.idOss = '';
                this.dataNodos.ipv4 = '';
            }
        }
    }
</script>