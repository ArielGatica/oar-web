<template>
    <v-container fluid grid-list-md text-xs-left>
        <v-layout row wrap align-center justify-center>
            <v-flex xs9 mt-11>
                <v-card>

                    <!--TOOLBAR-->
                    <v-toolbar
                        dark
                        color="#005BFF">
                        <v-toolbar-title class="headline">
                            <v-icon>speed</v-icon> Monitores
                        </v-toolbar-title>

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
                            <span>Eliminar Monitores</span>
                        </v-tooltip>

                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn
                                    v-on="on" 
                                    icon
                                    :disabled="selected[0] === undefined"
                                    @click="sendDataToEdit()">
                                    <v-icon>edit</v-icon>
                                </v-btn>
                            </template>
                            <span>Editar monitores</span>
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
                            <span>Agregar monitores</span>
                        </v-tooltip>

                    </v-toolbar>

                    <!-- TABLE -->
                    <v-data-table
                        dark
                        v-model="selected"
                        :items="items"
                        :headers="headers"
                        :footer-props="{
                            prevIcon: 'arrow_back_ios',
                            nextIcon: 'arrow_forward_ios'
                        }"
                        :loading="loading"
                        loading-text="Cargando registros..."
                        no-data-text="No se encontraron registros."
                        item-key="idKpi"
                        show-select
                        single-select>

                        <template v-slot:item.estado="{ item }">
                            <v-icon :color="getColor(item.estado)">{{ item.estado == true ? 'check_circle' : 'cancel' }}</v-icon>
                        </template>

                        <template v-slot:item.action="{ item }">
                            <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn 
                                    v-on="on"
                                    :disabled="btnRundeck" 
                                    icon @click="execRundeck()">
                                    <v-icon color="#FF3D00">
                                        {{ item.nombre == 'PIU Crash' ? 'play_circle_filled' : null || item.nombre == 'PIU Restart' ? 'play_circle_filled' : null }}
                                    </v-icon>
                                </v-btn>
                            </template>
                            <span>Ejecutar Rundeck</span>
                            </v-tooltip>
                        </template>

                    </v-data-table>                
                </v-card>

                <!--DIALOG ADD-->
                <v-dialog v-model="dialogAdd" width="750" persistent>
                    <v-card>
                        <v-card-title>
                            <span class="headline">Agregar</span>
                        </v-card-title>
                        <v-card-text>
                            <v-row>
                                <v-col cols="12" sm="7">
                                    <v-text-field
                                        v-model="dataMonitores.nombre"
                                        label="Nombre">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="5">
                                    <v-select
                                        :items="itemsDiagnostics"
                                        label="Diagnóstico a Evaluar"
                                        >
                                    </v-select>
                                </v-col>
                                <v-col cols="12" sm="3">
                                    <v-text-field
                                        v-model="dataMonitores.valorBajo"
                                        label="Valor Bajo">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="3">
                                    <v-text-field
                                        v-model="dataMonitores.valorMedio"
                                        label="Valor Medio">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="3">
                                    <v-text-field
                                        v-model="dataMonitores.valorAlto"
                                        label="Valor Alto">
                                    </v-text-field>
                                </v-col>         
                                <v-col cols="12" sm="3">
                                    <v-text-field
                                        v-model="dataMonitores.umbral"
                                        label="Umbral">
                                    </v-text-field>
                                </v-col>                 
                                <v-col cols="12" sm="6">
                                    <v-select
                                        v-model="dataMonitores.idCallbackDiagnostico"
                                        :items="itemsSolution"
                                        label="Callback a Ejecutar"
                                        append-icon="sync_problem">
                                    </v-select>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-text-field
                                        v-model="dataMonitores.retornoEsperado"
                                        label="Retorno Esperado">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="8">
                                    <v-select
                                        :items="itemsNodos"
                                        dense
                                        chips
                                        color="#005BFF"
                                        label="Nodo"
                                        multiple
                                        append-icon="public">
                                    </v-select>
                                </v-col>
                                <v-col cols="12" sm="4">
                                    <v-switch
                                        v-model="dataMonitores.estado"
                                        inset
                                        color="#005BFF"
                                        :label="`Estado: ${dataMonitores.estado == true ? 'Habilitado' : 'Deshabilitado'}`">
                                    </v-switch>
                                </v-col>       
                            </v-row>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                @click="dialogAdd = false; clearFields()"
                                color="#FF3D00"
                                dark>
                                Cancelar
                            </v-btn>
                            <v-btn
                                @click="addMonitores()"
                                dark
                                color="#005BFF">
                                Agregar
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>

                <!--DIALOG EDITT-->
                <v-dialog v-model="dialogEdit" width="750" persistent>
                    <v-card>
                        <v-card-title>
                            <span class="headline">Editar</span>
                        </v-card-title>
                        <v-card-text>
                            <v-row>
                                <v-col cols="12" sm="7">
                                    <v-text-field
                                        v-model="dataMonitores.nombre"
                                        label="Nombre">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="5">
                                    <v-select
                                        :items="itemsDiagnostics"
                                        label="Diagnóstico a Evaluar"
                                        >
                                    </v-select>
                                </v-col>
                                <v-col cols="12" sm="3">
                                    <v-text-field
                                        v-model="dataMonitores.valorBajo"
                                        label="Valor Bajo">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="3">
                                    <v-text-field
                                        v-model="dataMonitores.valorMedio"
                                        label="Valor Medio">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="3">
                                    <v-text-field
                                        v-model="dataMonitores.valorAlto"
                                        label="Valor Alto">
                                    </v-text-field>
                                </v-col>         
                                <v-col cols="12" sm="3">
                                    <v-text-field
                                        v-model="dataMonitores.umbral"
                                        label="Umbral">
                                    </v-text-field>
                                </v-col>                 
                                <v-col cols="12" sm="6">
                                    <v-select
                                        v-model="dataMonitores.idCallbackDiagnostico"
                                        :items="itemsSolution"
                                        append-icon="sync_problem"
                                        label="Callback a Ejecutar">
                                    </v-select>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-text-field
                                        v-model="dataMonitores.retornoEsperado"
                                        label="Retorno Esperado">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="8">
                                    <v-select
                                        :items="itemsNodos"
                                        dense
                                        chips
                                        color="#005BFF"
                                        label="Nodo"
                                        multiple
                                        append-icon="public">
                                    </v-select>
                                </v-col>
                                <v-col cols="12" sm="4">
                                    <v-switch
                                        v-model="dataMonitores.estado"
                                        inset
                                        color="#005BFF"
                                        :label="`Estado: ${dataMonitores.estado == true ? 'Habilitado' : 'Deshabilitado'}`">
                                    </v-switch>
                                </v-col>       
                            </v-row>
                        </v-card-text>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                @click="dialogEdit = false; clearFields()"
                                color="#FF3D00"
                                dark>
                                Cancelar
                            </v-btn>
                            <v-btn
                                @click="editMonitores()"
                                dark
                                color="#005BFF">
                                Editar
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
                            ¿Está seguro que desea Eliminar el registro <b>{{ this.selected[0].nombre }}</b> de Monitores?
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
                                @click="deleteMonitores()"
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
    import axios from 'axios';
    import { environments } from '../environments/environments';

    export default {
        data: () =>({
            dialogRemove: false,
            dialogEdit: false,
            dialogAdd: false,
            itemsCallback: [],
            itemsNodos: [],
            items: [],
            headers: [
                { text: 'Nombre', value: 'nombre' },
                { text: 'Estado', value: 'estado' },
                //{ text: 'Diagnóstico', value: 'idCallbackDiagnostico' }
            ],
            loading: false,
            selected: [],
            dataMonitores:{
                nombre: '',
                idCallbackDiagnostico: '',
                valorBajo: '',
                valorMedio: '',
                valorAlto: '',
                umbral: '',
                retornoEsperado: '',
                idNodo: '',
                estado: false
            },
            btnRundeck: false,
            timeSnack: 4000,
            snack: false,
            responseClient :{
                message: '',
                icon: '',
                color: '',
                colorText: ''
            },
            itemsDiagnostics: [
                'Diagnostico KPI Piu Restart',
                'Diagnostico KPI Piu Crash',
                'Diagnostico KPI Abnormal Holding',
                'Diagnostico KPI Abnormal Holding'
            ],
            itemsSolution:[
                'Solucion KPI Piu Restart',
                'Solucion KPI Piu Crash',
                'Solucion KPI Device Disable',
                'Solucion KPI Abnormal Holdingv'   
            ]
        }),
        beforeMount(){
            let self = this;
            self.loading = true;

            async function getDataMonitores(){
                try {
                    const readMonitores = await axios.get(`${environments.API_KPI_MONITOR}/Kpis`)
                    if(readMonitores)
                        return readMonitores
                } catch (error) {
                    return error;
                }
            }
            getDataMonitores().then((response) =>{
                if(response.status == 200){

                    axios.get(`${environments.API_KPI_MONITOR}/Callbacks`)
                    .then((responseCallbacks) =>{
                        let selectCallbacks = [];

                        responseCallbacks.data.forEach((value) =>{
                            selectCallbacks.push({
                                'text': value.callback,
                                'idCallback': value.idCallback
                            })
                        })
                        self.itemsCallback = selectCallbacks;

                        let newSalidaMonitores = [];

                        response.data.forEach((value) =>{
                            newSalidaMonitores.push({
                                idKpi: value.idKpi,
                                nombre: value.nombre,
                                estado: value.estado
                            })
                        })
                       
                        self.items = newSalidaMonitores;
                        self.loading = false;
                    })
                }
            })
            .catch((error) => { console.log(`Error al intentar listar data: ${error}`) });

            async function getDataNodos(){
                try {
                    const readNodos = await axios.get(`${environments.API_KPI_MONITOR}/Nodos`)
                    if(readNodos)
                        return readNodos
                } catch (error) {
                    return error;
                }
            }
            getDataNodos().then((response) =>{
                if(response.status == 200){
                    let selectNodos = [];

                    response.data.forEach((value) =>{
                        selectNodos.push({
                            'text': value.nodo,
                            'idNodo': value.idNodo
                        })
                    })
                    self.itemsNodos = selectNodos;
                }
            })
        },
        methods: {
            async callMonitores(){
                await axios.get(`${environments.API_KPI_MONITOR}/Kpis`)
                .then((response) =>{
                    if(response.status == 200)
                        this.items = response.data;
                })
            },
            getColor(state){
                if(state == true )
                    return '#01E9B2'
                else
                    return '#FF3D00'
            },
            async addMonitores(){
                await axios.post(`${environments.API_KPI_MONITOR}/Kpis`, this.dataMonitores)
                .then((response) =>{
                    if(response.status == 200){
                        this.callMonitores();
                        this.dialogAdd = false;
                        this.clearFields();
                        this.responseClient = {
                            message: 'Monitor Agregado correctamente',
                            icon: 'done_outline',
                            color: '#01E9B2',
                            colorText: '#005BFF'
                        }
                        this.snack = true;
                    }
                })
                .catch((error) =>{
                    this.responseClient = {
                        message: `Error al intentar agregar Monitores ${error}`,
                        icon: 'warning',
                        color: '#FF3D00',
                        colorText: '#FFF'
                    }
                    this.snack = true;
                    console.error(`Error al intentar agregar Monitores ${error}`)
                })
            },
            clearFields(){
                this.dataMonitores.nombre = '';
            },
            sendDataToEdit(){
                this.dialogEdit = true;
                Object.assign(this.dataMonitores, this.selected[0]);
            },
            async editMonitores(){
                await axios.put(`${environments.API_KPI_MONITOR}/Kpis/${this.selected[0].idKpi}`, this.dataMonitores)
                .then((response) =>{
                    if(response.status == 200){
                        this.dialogEdit = false;
                        this.callMonitores();
                        this.clearFields();
                        this.responseClient = {
                            message: 'Monitor Editado correctamente',
                            icon: 'done_outline',
                            color: '#01E9B2',
                            colorText: '#005BFF'
                        }
                        this.snack = true;
                    }
                })
                .catch((error) => {
                    this.responseClient = {
                        message: `Error al intentar editar Monitores ${error}`,
                        icon: 'warning',
                        color: '#FF3D00',
                        colorText: '#FFF'
                    }
                    this.snack = true;
                    console.log(`Error al intentar editar registro: ${error}`) 
                })
            },
            async deleteMonitores(){
                await axios.delete(`${environments.API_KPI_MONITOR}/Kpis/${this.selected[0].idKpi}`)
                .then((response) =>{
                    if(response.status == 200){
                        this.callMonitores();
                        this.dialogRemove = false;
                        this.responseClient = {
                            message: 'Monitor Agregado correctamente',
                            icon: 'done_outline',
                            color: '#01E9B2',
                            colorText: '#005BFF'
                        }
                        this.snack = true;
                    }
                })
                .catch((error) => {
                    this.responseClient = {
                        message: `Error al intentar eliminar Monitores ${error}`,
                        icon: 'warning',
                        color: '#FF3D00',
                        colorText: '#FFF'
                    }
                    this.snack = true;
                    console.log(`Error al intentar eliminar Monitores: ${error}`) 
                });
            },
            async execRundeck(){
                await axios.post(`${environments.RUNDECK}`)
                .then((response) =>{
                    this.responseClient = {
                        message: 'Ejecutando Rundeck',
                        icon: 'av_timer',
                        color: 'warning',
                        colorText: '#FFF'
                    }
                    this.snack = true;
                    this.btnRundeck = true;
                    setTimeout(() =>{  this.$router.push('/procesos') }, 3000);
                })
                .catch((error) => {
                    this.btnRundeck = true;
                    this.responseClient = {
                        message: 'Rundeck ejecutando otro proceso',
                        icon: 'av_timer',
                        color: 'warning',
                        colorText: '#FFF'
                    }
                    this.snack = true;
                }); 
            }
        }
    }
</script>