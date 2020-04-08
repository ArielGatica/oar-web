<template>
    <v-container fluid grid-list-md text-xs-left>
        <v-layout row wrap align-center justify-center>
            <v-flex xs9 mt-11>
                <v-card>
                    <v-toolbar color="teal" dark>
                        <v-toolbar-title class="headline">
                            <v-icon>description</v-icon> Registros
                        </v-toolbar-title>
                    
                        <v-spacer></v-spacer>

                        <v-tooltip v-model="iconRefresh" bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn
                                    v-on="on" 
                                    icon 
                                    @click="callLogs()"
                                    >
                                    <v-icon>refresh</v-icon>
                                </v-btn>
                            </template>
                            <span>Recargar registros</span>
                        </v-tooltip>

                        <v-tooltip v-model="iconFind" bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn 
                                    icon 
                                    v-on="on" 
                                    @click="sendDataSalida(); selected[0] !== undefined ? dialogRemove = true : snackInfo = true"
                                    >
                                    <v-icon>search</v-icon>
                                </v-btn>
                            </template>
                            <span>Ver salida</span>
                        </v-tooltip>                    
                    </v-toolbar>
                    
                    <!--
                    <v-tabs
                        v-model="tab"
                        height="64"
                        background-color="teal"
                        dark>

                        <v-tab
                            v-for="item in itemsTab"
                            :key="item">

                        </v-tab>
                    </v-tabs>
                    -->

                    <v-data-table
                        v-model="selected"
                        show-select
                        item-key="idOperacion"
                        single-select
                        :items="items"
                        :headers="headers"
                        :footer-props="{
                            prevIcon: 'arrow_back_ios',
                            nextIcon: 'arrow_forward_ios'
                        }"
                        :loading="loading"
                        loading-text="Cargando registros..."
                        no-data-text="No se encontraron registros.">

                        <template v-slot:item.fecha="{ item }">
                            {{ item.fecha | dateFormat}}
                        </template>

                    </v-data-table>
                </v-card>

                <!--DIALOG DATA SALIDA-->
                <v-dialog dark v-model="dialogSalida" width="1000"> 
                    <v-card>
                        <v-card-title class="headline">Salida</v-card-title>
                        <v-card-text v-if="dataSalida !== undefined">
                            {{dataSalida}}
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="teal" dark @click="dialogSalida = false">Cerrar</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>

                <!--SNACK INFO-->
                <v-snackbar v-model="snackInfo" color="error" top :timeout="timeSnack">
                    Debes seleccionar al menos un registro para realizar esta acción.
                    <v-spacer/>
                    <v-btn icon @click="snackInfo = false">
                        <v-icon>info</v-icon>
                    </v-btn>
                </v-snackbar>

            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import axios from 'axios';
    import { environments } from '../environments/environments';
    import moment from 'moment';

    export default {
        name: 'Logs',
        data: () =>({
            selected: [],
            dataSalida: '',
            dialogSalida: false,
            items: [],
            headers: [
                { text: 'Command', value: 'comando' },
                { text: 'Nodo', value: 'idNodo' },
                { text: 'Callback', value: 'idCallback' },
                { text: 'Date', value: 'fecha' },
                { text: 'Monitor', value: 'idKpi' }
            ],
            loading: false,
            iconFind: false,
            snackInfo: false,
            iconRefresh: false,
            timeSnack: 3000,
            itemsTab:[
                { text: 'Diagnóstico', icon: 'description' },
                { text: 'Ejecuciones', icon: 'description' }
            ],
            tab: null
        }),
        filters:{
            dateFormat: (date) =>{
                return moment(date).format("YYYY-MM-DD - HH:mm:ss");
            }
        },
        beforeMount(){
            let self = this;
            self.loading = true;

            async function getDataLogs(){
                try {
                    const getReadLogs = await axios.get(`${environments.API_KPI_MONITOR}/OperacionLogs`)
                    if(getReadLogs)
                        return getReadLogs
                } catch (error) {
                    return error
                }
            }
            getDataLogs().then((response) =>{
                if(response.status == 200) {

                    axios.get(`${environments.API_KPI_MONITOR}/Kpis`)
                    .then((responseMonitor) =>{

                        axios.get(`${environments.API_KPI_MONITOR}/Nodos`)
                        .then((responseNodos) =>{

                            axios.get(`${environments.API_KPI_MONITOR}/Callbacks`)
                            .then((responseCallbacks)  =>{

                                const groypByCallbacks = responseCallbacks.data.reduce((acc, data) =>{
                                    if(!acc[data.idCallback])
                                        acc[data.idCallback] = [];

                                    acc[data.idCallback].push(data);
                                    return acc;
                                },{});

                                const groupByIdNodo = responseNodos.data.reduce((acc, data) =>{
                                    if(!acc[data.idNodo])
                                        acc[data.idNodo] = [];

                                    acc[data.idNodo].push(data);
                                    return acc;
                                }, {});

                                const groupByIdMonitor = responseMonitor.data.reduce((accumulator, data) =>{
                                    if(!accumulator[data.idKpi])
                                        accumulator[data.idKpi] = [];

                                    accumulator[data.idKpi].push(data);
                                    return accumulator;
                                }, {});

                                let newSalidaMonitor = [];

                                response.data.forEach((value) =>{
                                    newSalidaMonitor.push({
                                        idOperacion: value.idOperacion,
                                        comando: value.comando,
                                        salida: value.salida,
                                        idNodo: groupByIdNodo[value.idNodo][0]['nodo'],
                                        idCallback: groypByCallbacks[value.idCallback][0]['callback'],
                                        fecha: value.fecha,
                                        idKpi: groupByIdMonitor[value.idKpi][0]['nombre']                            
                                    })
                                })

                                self.items = newSalidaMonitor;
                                self.loading = false;

                            })
                        })
                    })
                }
            })
            .catch((err) => { console.log(`Error al intentar listar data: ${err}`)} );
        },
        methods:{
            async callLogs(){
                await axios.get(`${environments.API_KPI_MONITOR}/OperacionLogs`)
                .then((response) =>{
                    if(response.status == 200) {

                        axios.get(`${environments.API_KPI_MONITOR}/Kpis`)
                        .then((responseMonitor) =>{

                            axios.get(`${environments.API_KPI_MONITOR}/Nodos`)
                            .then((responseNodos) =>{

                                axios.get(`${environments.API_KPI_MONITOR}/Callbacks`)
                                .then((responseCallbacks)  =>{

                                    const groypByCallbacks = responseCallbacks.data.reduce((acc, data) =>{
                                        if(!acc[data.idCallback])
                                            acc[data.idCallback] = [];

                                        acc[data.idCallback].push(data);
                                        return acc;
                                    },{});

                                    const groupByIdNodo = responseNodos.data.reduce((acc, data) =>{
                                        if(!acc[data.idNodo])
                                            acc[data.idNodo] = [];

                                        acc[data.idNodo].push(data);
                                        return acc;
                                    }, {});

                                    const groupByIdMonitor = responseMonitor.data.reduce((accumulator, data) =>{
                                        if(!accumulator[data.idKpi])
                                            accumulator[data.idKpi] = [];

                                        accumulator[data.idKpi].push(data);
                                        return accumulator;
                                    }, {});

                                    let newSalidaMonitor = [];

                                    response.data.forEach((value) =>{
                                        newSalidaMonitor.push({
                                            comando: value.comando,
                                            idNodo: groupByIdNodo[value.idNodo][0]['nodo'],
                                            idCallback: groypByCallbacks[value.idCallback][0]['callback'],
                                            fecha: value.fecha,
                                            idKpi: groupByIdMonitor[value.idKpi][0]['nombre']                            
                                        })
                                    })

                                    self.items = newSalidaMonitor;
                                    self.loading = false;

                                })
                            })
                        })
                    }
                })
            },
            async sendDataSalida(){
                if(this.selected[0] !== undefined){
                    this.dialogSalida = true;
                    this.dataSalida = this.selected[0].salida;
                }
            }
        }
    }  
</script>