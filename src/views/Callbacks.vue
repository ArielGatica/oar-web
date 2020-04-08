<template>
    <v-container fluid grid-list-md text-xs-left>
        <v-layout row wrap align-center justify-center>
            <v-flex xs9 mt-11>
                <v-card>
                    
                    <!--TOOLBAR-->
                    <v-toolbar color="#005BFF" dark>
                        <v-toolbar-title class="headline">
                            <v-icon>sync_problem</v-icon> Callbacks
                        </v-toolbar-title>

                        <v-spacer></v-spacer>
                        
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn
                                    :disabled="selected[0] === undefined"
                                    v-on="on" 
                                    icon 
                                    @click="dialogRemove = true">
                                    <v-icon>delete</v-icon>
                                </v-btn>
                            </template>
                            <span>Eliminar Callbacks</span>
                        </v-tooltip>

                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn
                                    :disabled="selected[0] === undefined"
                                    v-on="on" 
                                    icon 
                                    @click="sendDataToEdit()">
                                    <v-icon>edit</v-icon>
                                </v-btn>
                            </template>
                            <span>Editar Callbacks</span>
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
                            <span>Agregar Callbacks</span>
                        </v-tooltip>

                    </v-toolbar>

                    <!--TABLE-->
                    <v-data-table
                        v-model="selected"
                        show-select
                        item-key="idCallback"
                        single-select
                        :items="items"
                        :headers="headers"
                        :footer-props="{
                            prevIcon: 'arrow_back_ios',
                            nextIcon: 'arrow_forward_ios'
                        }"
                        :loading="loading"
                        loading-text="Cargando registros..."
                        no-data-text="No se encontrarón registros.">

                        <template v-slot:item.estado="{ item }">
                            <v-icon :color="getColor(item.estado)">{{ item.estado == true ? 'check_circle' : 'cancel' }}</v-icon>
                        </template>

                    </v-data-table>
                </v-card>

                <!--ADD DIALOG-->
                <v-dialog v-model="dialogAdd" width="750" persistent>
                    <v-card>
                        <v-card-title class="headline">Agregar</v-card-title>
                        <v-card-text>
                            <v-row>
                                <v-col cols="12" sm="6">
                                    <v-text-field
                                        v-model="dataCallbacks.callback"
                                        label="Nombre"
                                        color="#005BFF">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-select
                                        v-model="dataCallbacks.idTipoCallback"
                                        :items="itemsCallback"
                                        label="Tipo"
                                        color="#005BFF">
                                    </v-select>
                                </v-col>

                                <v-col cols="12" sm="6">
                                    <v-text-field
                                        v-model="dataCallbacks.rutaCallback"
                                        label="Ruta"
                                        hint="http://some-routes"
                                        color="#005BFF">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-select
                                        v-model="dataCallbacks.idClase"
                                        :items="itemsClase"
                                        label="Clase"
                                        color="#005BFF">
                                    </v-select>
                                </v-col>
                            </v-row>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                @click="dialogAdd = false"
                                dark
                                color="#FF3D00">
                                Cancelar
                            </v-btn>
                            <v-btn
                                @click="addCallbacks()"
                                dark
                                color="#005BFF">
                                Agregar
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>

                <!--EDIT DIALOG-->
                <v-dialog v-model="dialogEdit" width="750" persistent>
                    <v-card>
                        <v-card-title class="headline">Editar</v-card-title>
                        <v-card-text>
                            <v-row>
                                <v-col cols="12" sm="6">
                                    <v-text-field
                                        v-model="dataCallbacks.callback"
                                        label="Nombre"
                                        color="#005BFF">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-select
                                        v-model="dataCallbacks.idTipoCallback"
                                        :items="itemsCallback"
                                        label="Tipo"
                                        color="#005BFF">
                                    </v-select>
                                </v-col>

                                <v-col cols="12" sm="6">
                                    <v-text-field
                                        v-model="dataCallbacks.rutaCallback"
                                        label="Ruta"
                                        hint="http://some-routes"
                                        color="#005BFF">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-select
                                        v-model="dataCallbacks.idClase"
                                        :items="itemsClase"
                                        label="Clase"
                                        color="#005BFF">
                                    </v-select>
                                </v-col>
                            </v-row>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                @click="dialogEdit = false"
                                dark
                                color="#FF3D00">
                                Cancelar
                            </v-btn>
                            <v-btn
                                @click="editCallbacks()"
                                dark
                                color="#005BFF">
                                Editar
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>

                <!--DELETE DIALOG-->
                <v-dialog v-model="dialogRemove" max-width="450" persistent>
                    <v-card>
                        <v-card-title>
                            <span class="headline">Eliminar</span>
                        </v-card-title>
                        <v-card-text class="body-1" v-if="this.selected[0] !== undefined">
                            ¿Está seguro que desea Eliminar el registro <b>{{ this.selected[0].callback }}</b> de Callbacks?
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer/>
                            <v-btn
                                @click="dialogRemove = false; clearFields()"
                                dark
                                color="#FF3D00"
                                >
                                Cancelar
                            </v-btn>
                            <v-btn
                                @click="deleteCallback()"
                                dark
                                color="#005BFF">
                                Eliminar
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
    import { environments } from '../environments/environments';
    import axios from 'axios';

    export default {
        data:() =>({
            dialogAdd : false,
            dialogRemove: false,
            dialogEdit: false,
            selected: [],
            items: [],
            headers: [
                { text: 'Nombre', value: 'callback' },
                { text: 'Tipo', value: 'idTipoCallback' },
                { text: 'Ruta', value: 'rutaCallback' },
                { text: 'Clase', value: 'idClase' },
                { text: 'Estado', value: 'estado' }
            ],
            loading: false,
            dataCallbacks:{
                callback: '',
                idTipoCallback: '',
                rutaCallback: '',
                idClase: '', 
                estado: true
            },
            itemsCallback: [],
            itemsClase: [],
            timeSnack: 4000,
            snack: false,
            responseClient :{
                message: '',
                icon: '',
                color: '',
                colorText: ''
            },
        }),
        beforeMount(){
            let self = this;
            self.loading = true;

            async function getDataCallbacks(){
                try {
                    const readCallbacks = await axios.get(`${environments.API_KPI_MONITOR}/Callbacks`)
                    if(readCallbacks)
                        return readCallbacks;
                } catch (error) {
                    return error;
                }
            }
            getDataCallbacks().then((response) =>{
                if(response.status == 200){

                    axios.get(`${environments.API_KPI_MONITOR}/TipoCallbacks`)
                    .then((responseTipoCallbacks) =>{
                        let selectCallback = [];

                        responseTipoCallbacks.data.forEach((value) =>{
                            selectCallback.push({
                                'text': value.tipo,
                                'value': value.idTipo
                            })
                        })

                        self.itemsCallback = selectCallback;

                        axios.get(`${environments.API_KPI_MONITOR}/ClaseCallbacks`)
                        .then((responseClaseCallbacs) =>{
                            let selectClase = [];

                            responseClaseCallbacs.data.forEach((value) =>{
                                selectClase.push({
                                    'text': value.clase,
                                    'value': value.idClase
                                })
                            })

                            self.itemsClase = selectClase;

                            const groupByIdTipoCallbacks = responseTipoCallbacks.data.reduce((acc, data) =>{
                                if(!acc[data.idTipo])
                                    acc[data.idTipo] = [];

                                acc[data.idTipo].push(data);
                                return acc;
                            }, {});

                            const groupByIdClaseCallbacks = responseClaseCallbacs.data.reduce((acc, data) =>{
                                if(!acc[data.idClase])
                                    acc[data.idClase] = [];

                                acc[data.idClase].push(data);
                                return acc;
                            }, {});

                            let newItemsCallbacks = [];

                            response.data.forEach((value) =>{
                                newItemsCallbacks.push({
                                    idCallback: value.idCallback,
                                    callback: value.callback,
                                    idTipoCallback: groupByIdTipoCallbacks[value.idTipoCallback][0]['tipo'],
                                    rutaCallback: value.rutaCallback,
                                    idClase: groupByIdClaseCallbacks[value.idClase][0]['clase'],
                                    estado: value.estado
                                })
                            })

                            self.items = newItemsCallbacks;
                            self.loading = false

                        })
                    })
                }   
            })
            .catch((error) =>{
                console.log(`Error al intentar listar Callbacks: ${error}` );
            })
        },
        methods: {
            getColor(state){
                if(state == true )
                    return '#01E9B2'
                else
                    return '#FF3D00'
            },
            clearFields(){
                this.dataCallbacks.callback = '';
                this.dataCallbacks.idTipoCallback = '';
                this.dataCallbacks.rutaCallback = '';
                this.dataCallbacks.idClase = '';
            },
            async getCallbacks(){
                this.loading = true;

                await axios.get(`${environments.API_KPI_MONITOR}/Callbacks`)
                .then((response) =>{
                    if(response.status == 200){

                        axios.get(`${environments.API_KPI_MONITOR}/TipoCallbacks`)
                        .then((responseTipoCallbacks) =>{

                            axios.get(`${environments.API_KPI_MONITOR}/ClaseCallbacks`)
                            .then((responseClaseCallbacs) =>{

                                const groupByIdTipoCallbacks = responseTipoCallbacks.data.reduce((acc, data) =>{
                                    if(!acc[data.idTipo])
                                        acc[data.idTipo] = [];

                                    acc[data.idTipo].push(data);
                                    return acc;
                                }, {});

                                const groupByIdClaseCallbacks = responseClaseCallbacs.data.reduce((acc, data) =>{
                                    if(!acc[data.idClase])
                                        acc[data.idClase] = [];

                                    acc[data.idClase].push(data);
                                    return acc;
                                }, {});

                                let newItemsCallbacks = [];

                                response.data.forEach((value) =>{
                                    newItemsCallbacks.push({
                                        idCallback: value.idCallback,
                                        callback: value.callback,
                                        idTipoCallback: groupByIdTipoCallbacks[value.idTipoCallback][0]['tipo'],
                                        rutaCallback: value.rutaCallback,
                                        idClase: groupByIdClaseCallbacks[value.idClase][0]['clase'],
                                        estado: value.estado
                                    })
                                })

                                this.items = newItemsCallbacks;
                                this.loading = false;

                            })
                        })
                    }
                })
            },
            async addCallbacks(){
                await axios.post(`${environments.API_KPI_MONITOR}/Callbacks`, this.dataCallbacks)
                .then((response) =>{
                    if(response.status == 200){
                        this.dialogAdd = false;
                        this.getCallbacks();
                        this.clearFields();
                        this.responseClient = {
                            message: 'Callback agregado correctamente',
                            icon: 'done_outline',
                            color: '#01E9B2',
                            colorText: '#005BFF'
                        }
                        this.snack = true;
                    }
                })
                .catch((error) =>{
                    console.log(`${error}`)
                    this.responseClient = {
                        message: `Error al intentar agregar Callback ${error}`,
                        icon: 'warning',
                        color: '#FF3D00',
                        colorText: '#FFF'
                    }
                    this.snack = true;
                })
            },
            async deleteCallback(){
                await axios.delete(`${environments.API_KPI_MONITOR}/Callbacks/${this.selected[0].idCallback}`)
                .then((response) =>{
                    if(response.status == 200){
                        this.getCallbacks();
                        this.dialogRemove = false;
                        this.responseClient = {
                            message: 'Callback Eliminado correctamente',
                            icon: 'done_outline',
                            color: '#01E9B2',
                            colorText: '#005BFF'
                        }
                        this.snack = true;
                    }
                })
                .catch((error) =>{
                    console.log(`${error}`);
                    this.responseClient = {
                        message: `Error al intentar eliminar Callback ${error}`,
                        icon: 'warning',
                        color: '#FF3D00',
                        colorText: '#FFF'
                    }
                    this.snack = true;
                })
            },
            sendDataToEdit(){
                this.dialogEdit = true;
                Object.assign(this.dataCallbacks, this.selected[0]);
            },
            async editCallbacks(){
                await axios.put(`${environments.API_KPI_MONITOR}/Callbacks/${this.selected[0].idCallback}`, this.dataCallbacks)
                .then((response) =>{
                    if(response.status == 200){
                        this.dialogEdit = false;
                        this.getCallbacks();
                        this.clearFields();
                        this.responseClient = {
                            message: 'Callback editado correctamente',
                            icon: 'done_outline',
                            color: '#01E9B2',
                            colorText: '#005BFF'
                        }
                        this.snack = true;
                    }
                })
                .catch((error) =>{
                    console.log(`${error}`)
                    this.responseClient = {
                        message: `Error al intentar agregar Callback ${error}`,
                        icon: 'warning',
                        color: '#FF3D00',
                        colorText: '#FFF'
                    }
                    this.snack = true;
                })
            }
        }
    }
</script>
