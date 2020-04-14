<template>
    <v-container fluid grid-list-md text-xs-left>
        <v-layout row wrap align-center justify-center>
            <v-flex xs9 mt-11>
                <v-card>

                    <!--TOOLBAR-->
                    <v-toolbar color="#10163a" dark>
                        <v-toolbar-title class="'info_device''eadline">
                            <v-icon>tv</v-icon> Monitor Eventos
                        </v-toolbar-title>
                        <v-spacer></v-spacer>

                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn
                                    :disabled="selected[0] == undefined"
                                    @click="dialogBlock = true"
                                    v-on="on"
                                    icon>
                                    <v-icon>lock</v-icon>
                                </v-btn>
                            </template>
                            <span>Bloquear</span>
                        </v-tooltip>

                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn
                                    :disabled="selected[0] == undefined"
                                    @click="dialogUnblock = true"
                                    v-on="on"
                                    icon>
                                    <v-icon>lock_open</v-icon>
                                </v-btn>
                            </template>
                            <span>Desbloquear</span>
                        </v-tooltip>

                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn
                                    :disabled="selected[0] == undefined"
                                    @click="dialogConfirmRestart = true"
                                    v-on="on"
                                    icon>
                                    <v-icon>build</v-icon>
                                </v-btn>
                            </template>
                            <span>Reinicio</span>
                        </v-tooltip>

                    </v-toolbar>

                    <!--TABLE-->
                    <v-data-table
                        v-model="selected"
                        show-select
                        single-select
                        item-key="idMonitor"
                        :items="items"
                        :headers="headers"
                        :footer-props="{
                            prevIcon: 'arrow_back_ios',
                            nextIcon: 'arrow_forward_ios'
                        }"
                        loading-text="Cargando registros..."
                        no-data-text="No se encontraron registros."
                        :loading="loading">

                        <template v-slot:item.actions="{ item }">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-btn
                                        @click="getRegistros(item)"
                                        v-on="on"
                                        icon 
                                        color="#FBC02D" 
                                        small>
                                        <v-icon>description</v-icon>
                                    </v-btn>
                                </template>
                                <span>Logs</span>
                            </v-tooltip>
                        </template>

                        <template v-slot:item.loader>
                            <v-progress-circular
                                v-if="loaderRundeck"
                                indeterminate
                                color="#01E9B2">
                            </v-progress-circular>
                        </template>

                        <template v-slot:item.estado="{ item }">
                            <!--<v-chip style="color:#FFF" :color="getColor(item)">{{ item.estado == 0 ? 'FALLÓ' : item.estado }}</v-chip>-->
                            <v-icon :color="getColor(item)">{{ item.estado == 0 ? 'mood_bad' : 'mood' }}</v-icon>
                        </template>

                        <template  v-slot:item.historyRestart="{ item }" style="background-color:'#FFF'">
                            <v-chip style="color:#FFF" color="red">{{ item.historyRestart }}</v-chip>
                        </template>

                        <template  v-slot:item.blockRestart="{ item }" style="background-color:'#FFF'">
                            <v-chip style="color:#000" color="yellow">{{ item.blockRestart }}</v-chip>
                        </template>

                    </v-data-table>
                </v-card>

                <!--DIALOG/TABLE REGISTROS-->
                <v-dialog v-model="dialogRegistros" width="750">
                    <v-card>
                        <br>
                        <v-card-text>
                            <v-card>
                                <v-toolbar
                                    color="#005BFF"
                                    dark>

                                    <v-toolbar-title>
                                        <v-icon>description</v-icon> Registro
                                    </v-toolbar-title>
                                </v-toolbar>

                                <!-- TABLE REGISTROS -->
                                <v-data-table
                                    :loading="loadingRegistro"
                                    item-key="idOperacion"
                                    :items="itemsRegistros"
                                    :footer-props="{
                                        prevIcon: 'arrow_back_ios',
                                        nextIcon: 'arrow_forward_ios'
                                    }"
                                    loading-text="Cargando registros..."
                                    :headers="headersRegistros">

                                    <template v-slot:item.action="{ item }">
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-btn
                                                    @click="findDataSalida(item)"
                                                    v-on="on" 
                                                    icon>
                                                    <v-icon color="#FF3D00">find_in_page</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>Ver comando</span>
                                        </v-tooltip>
                                    </template>

                                </v-data-table>
                            </v-card>
                        </v-card-text>
                    </v-card>
                </v-dialog>

                <!--DIALOG DATA SALIDA-->
                <v-dialog dark v-model="dialogSalida" width="900" scrollable>
                    <v-card>
                        <v-card-title class="headline">Comando</v-card-title>
                        <v-card-text v-if="dataSalida !== undefined">
                            <div style="white-space: pre-line;">{{dataSalida}}</div>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="#01E9B2" style="color:#005BFF" @click="dialogSalida = false">Cerrar</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>

                <!--DIALOG RESTART-->
                <v-dialog v-model="dialogConfirmRestart" width="400" persistent>
                    <v-card>
                        <v-card-title class="headline">Reinicio</v-card-title>
                        <template>
                            <v-card-text v-if="selected[0] !== undefined">
                                ¿Está seguro que desea realizar un Reinicio a <b>{{selected[0].idKpi}}</b>
                                asociado a el Nodo <b>{{selected[0].idNodo}}</b>?
                            </v-card-text>
                        </template>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                @click="dialogConfirmRestart = false"
                                dark
                                color="#FF3D00">
                                Cancelar
                            </v-btn>
                            <v-btn
                                @click="restartRundeck()"
                                dark
                                color="#005BFF">
                                Reinicio
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>

                <!--DIALOG BLOCK-->
                <v-dialog v-model="dialogBlock" width="400" persistent>
                    <v-card>
                        <v-card-title class="headline">Bloquear</v-card-title>
                        <template>
                            <v-card-text v-if="selected[0] !== undefined">
                                ¿Está seguro que desea Bloquear a <b>{{selected[0].idKpi}}</b>
                                asociado a el Nodo <b>{{selected[0].idNodo}}</b>?
                            </v-card-text>
                        </template>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                @click="dialogBlock = false"
                                dark
                                color="#FF3D00">
                                Cancelar
                            </v-btn>
                            <v-btn
                                @click="blockRundeck()"
                                dark
                                color="#005BFF">
                                Bloquear
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>

                <!--DIALOG UNBLOCK-->
                <v-dialog v-model="dialogUnblock" width="400" persistent>
                    <v-card>
                        <v-card-title class="headline">Desbloquear</v-card-title>
                        <template>
                            <v-card-text v-if="selected[0] !== undefined">
                                ¿Está seguro que desea Desbloquear a <b>{{selected[0].idKpi}}</b>
                                asociado a el Nodo <b>{{selected[0].idNodo}}</b>?
                            </v-card-text>
                        </template>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                @click="dialogUnblock = false"
                                dark
                                color="#FF3D00">
                                Cancelar
                            </v-btn>
                            <v-btn
                                @click="unblockRundeck()"
                                dark
                                color="#005BFF">
                                Desbloquear
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
        data:() =>({
            selected: [],
            dataSalida: '',
            dialogSalida: false,
            dialogRegistros: false,
            dialogConfirmRestart: false,
            dialogBlock: false,
            dialogUnblock: false,
            headers:[
                { text: 'Monitor', value: 'idKpi' },
                { text: 'Nodo', value: 'idNodo' },
                { text: 'Dispositivos', value: 'argumentos' },
                { text: 'Información Fallo', value: 'resultado' },
                { text: 'Reinicio', value: 'historyRestart' },
                { text: 'Bloqueo', value: 'blockRestart' },
                { text: 'Estado', value: 'estado' },
                { text: 'Logs', value: 'actions', sortable: false },
                { value: 'loader', sortable: false }
            ],
            items:[],
            loading: false,
            loadingRegistro: false,
            itemsRegistros: [],
            headersRegistros: [
                { text: 'Comando', value: 'comando' },
                { text: 'Fecha', value: 'fecha' },
                { text: 'Salida', value: 'action', sortable: false }
            ],
            timeSnack: 5000,
            snack: false,
            responseClient :{
                message: '',
                icon: '',
                color: '',
                colorText: ''
            },
            loaderRundeck: false
        }),
        beforeMount(){
            let self = this;
            self.loading = true;

            async function getMonitorEvents(){
                try {
                    const readMonitorEvents = await axios.get(`${environments.API_KPI_MONITOR}/Monitors?filter=%7B%22where%22%3A%20%7B%20%22estado%22%3A%20%220%22%7D%7D`)
                    if(readMonitorEvents)
                        return readMonitorEvents;
                } catch (error) {
                    return error;
                }
            }
            getMonitorEvents().then((response) =>{
                if(response.status == 200){
                    
                    axios.get(`${environments.API_KPI_MONITOR}/Kpis`)
                    .then((responseKpis) =>{

                        axios.get(`${environments.API_KPI_MONITOR}/Nodos`)
                        .then((responseNodos) =>{

                            const groupByIdKpis = responseKpis.data.reduce((acc, data) =>{
                                if(!acc[data.idKpi])
                                    acc[data.idKpi] = [];
                                acc[data.idKpi].push(data);
                                return acc;
                            }, {});

                            const groupByIdNodos = responseNodos.data.reduce((acc, data) =>{
                                if(!acc[data.idNodo])
                                    acc[data.idNodo] = [];

                                acc[data.idNodo].push(data);
                                return acc;
                            }, {});

                            let newItemsMonitorEvents = [];

                            response.data.forEach((value) =>{

                                let toSplit = value.argumentos.split(',');
                                let newArgument = toSplit[2].replace(/'board': '|'/g, '');
                                let restartHistory = toSplit[6].replace(/'restart_qty': |'/g, '');
                                let blockHistory = toSplit[7].replace(/'block_qty': |'|}/g, '');

                                newItemsMonitorEvents.push({
                                    idMonitor: value.idMonitor,
                                    fecha: value.fecha,
                                    idKpi: groupByIdKpis[value.idKpi][0]['nombre'],
                                    idNodo: groupByIdNodos[value.idNodo][0]['nodo'],
                                    resultado: value.resultado,
                                    estado: value.estado,
                                    argumentos: value.tarjeta + ' - ' + newArgument,
                                    historyRestart: 'R = ' + restartHistory,
                                    blockRestart: 'B = ' + blockHistory,
                                })
                            })

                            self.items = newItemsMonitorEvents;
                            self.loading = false;
                        })
                    })
                }
            })
            .catch((error) => { console.log(`Error al intentar listar data ${error}`)});
        },
        methods:{
            getColor(item){
                if(item.estado === 0)
                    return 'red';
                else if(item.estado == 1)
                    return 'success';
                else if(item.estado == 3)
                    return '#FBC02D';
            },
            async callMonitorEvents(){
                await axios.get(`${environments.API_KPI_MONITOR}/Monitors?filter=%7B%22where%22%3A%20%7B%20%22estado%22%3A%20%220%22%7D%7D`)
                .then((response) =>{
                    if(response.status == 200){
                    
                        axios.get(`${environments.API_KPI_MONITOR}/Kpis`)
                        .then((responseKpis) =>{

                            axios.get(`${environments.API_KPI_MONITOR}/Nodos`)
                            .then((responseNodos) =>{

                                const groupByIdKpis = responseKpis.data.reduce((acc, data) =>{
                                    if(!acc[data.idKpi])
                                        acc[data.idKpi] = [];

                                    acc[data.idKpi].push(data);
                                    return acc;
                                }, {});

                                const groupByIdNodos = responseNodos.data.reduce((acc, data) =>{
                                    if(!acc[data.idNodo])
                                        acc[data.idNodo] = [];

                                    acc[data.idNodo].push(data);
                                    return acc;
                                }, {});

                                let newItemsMonitorEvents = [];

                                response.data.forEach((value) =>{

                                    let toSplit = value.argumentos.split(',');
                                    let newArgument = toSplit[1].replace("'target': '", '');

                                    newItemsMonitorEvents.push({
                                        idMonitor: value.idMonitor,
                                        fecha: value.fecha,
                                        idKpi: groupByIdKpis[value.idKpi][0]['nombre'],
                                        idNodo: groupByIdNodos[value.idNodo][0]['nodo'],
                                        resultado: value.resultado,
                                        estado: value.estado,
                                        argumentos: newArgument
                                    })
                                })

                                this.items = newItemsMonitorEvents;
                                this.loading = false;
                            })
                        })
                    }
                })
            },
            async getRegistros(item){
                this.loadingRegistro = true;
                const indexIdKpi = item.idMonitor;
                this.dialogRegistros = true;

                await axios.get(`${environments.API_KPI_MONITOR}/OperacionLogs?filter=%7B%22where%22%3A%20%7B%22idMonitor%22%3A%20${indexIdKpi}%7D%7D`)
                .then((response) =>{
                    if(response.status == 200) {

                        axios.get(`${environments.API_KPI_MONITOR}/Kpis`)
                        .then((responseMonitor) =>{

                            axios.get(`${environments.API_KPI_MONITOR}/Nodos`)
                            .then((responseNodos) =>{

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
                                        fecha: value.fecha,
                                        idKpi: groupByIdMonitor[value.idKpi][0]['nombre']
                                    })
                                })

                                this.itemsRegistros = newSalidaMonitor;
                                this.loadingRegistro = false;

                            })
                        })
                    }
                })
            },
            findDataSalida(item){
                const indexComando = item.salida;
                this.dialogSalida = true;
                this.dataSalida = indexComando;
            },
            async restartRundeck(){
                await axios.post(`${environments.URI_RUNDECK}${environments.API_RUNDECK}run?authtoken=${environments.TOKEN}`, 
                    { "argString": `-idmonitor ${this.selected[0].idMonitor}` },
                    { headers: { 'Accept': 'application/json' }}
                )
                .then((response) =>{
                    if(response !== undefined){
                        const idProcess = response.data.id;

                        axios.get(`${environments.URI_RUNDECK}execution/${idProcess}?authtoken=${environments.TOKEN}`, 
                            { headers: { 'Accept': 'application/json' }}
                        )
                        .then((responseProcess) =>{
                            if(responseProcess.data.status === 'running'){
                                this.dialogConfirmRestart = false;
                                this.responseClient = {
                                    message: 'Reinicio ejecutado correctamente',
                                    icon: 'done_outline',
                                    color: '#01E9B2',
                                    colorText: '#005BFF'
                                }
                                this.snack = true;
                                this.loaderRundeck = true;
                                setTimeout(() => {
                                    this.loaderRundeck = false;
                                    this.callMonitorEvents();
                                }, 30000)
                            }
                        })
                    }
                })
                .catch((error) =>{
                    this.responseClient = {
                        message: `Error al intentar ejecutar Reinicio ${error}`,
                        icon: 'warning',
                        color: '#FF3D00',
                        colorText: '#FFF'
                    }
                    console.log(`Error ${error}`)
                });
            },
            async blockRundeck(){
                await axios.post(`${environments.URI_RUNDECK}${environments.API_RUNDECK}run?authtoken=${environments.TOKEN}`, 
                    { "argString": `-idMonitor ${this.selected[0].idMonitor} -newop block` },
                    { headers: { 'Accept': 'application/json' }}
                )
                .then((response) =>{
                    if(response !== undefined){
                        const idProcess = response.data.id;

                        axios.get(`${environments.URI_RUNDECK}execution/${idProcess}?authtoken=${environments.TOKEN}`, 
                            { headers: { 'Accept': 'application/json' }}
                        )
                        .then((responseProcess) =>{
                            if(responseProcess.data.status === 'running'){
                                this.dialogBlock = false;
                                this.responseClient = {
                                    message: 'Bloqueo ejecutado correctamente',
                                    icon: 'done_outline',
                                    color: '#01E9B2',
                                    colorText: '#005BFF'
                                }
                                this.snack = true;
                                this.loaderRundeck = true;
                                setTimeout(() => {
                                    this.loaderRundeck = false;
                                    this.callMonitorEvents();
                                }, 30000)
                            }
                        })             
                    }
                })
                .catch((error) => {
                    this.responseClient = {
                        message: `Error al intentar ejecutar Bloqueo ${error}`,
                        icon: 'warning',
                        color: '#FF3D00',
                        colorText: '#FFF'
                    }
                    console.log(`Error ${error}`) 
                });
            },
            async unblockRundeck(){
                await axios.post(`${environments.URI_RUNDECK}${environments.API_RUNDECK}run?authtoken=${environments.TOKEN}`, 
                    { "argString": `-idMonitor ${this.selected[0].idMonitor} -newop unblock` },
                    { headers: { 'Accept': 'application/json' }}
                )
                .then((response) =>{
                    if(response !== undefined){
                        const idProcess = response.data.id;

                        axios.get(`${environments.URI_RUNDECK}execution/${idProcess}?authtoken=${environments.TOKEN}`, 
                            { headers: { 'Accept': 'application/json' }}
                        )
                        .then((responseProcess) =>{
                            if(responseProcess.data.status === 'running'){
                                this.dialogUnblock = false;
                                this.responseClient = {
                                    message: 'Desbloqueo ejecutado correctamente',
                                    icon: 'done_outline',
                                    color: '#01E9B2',
                                    colorText: '#005BFF'
                                }
                                this.snack = true;
                                setTimeout(() =>{
                                    this.loaderRundeck = false;
                                    this.callMonitorEvents();
                                }, 30000)
                            }
                        })
                    }
                })
                .catch((error) => {
                    this.responseClient = {
                        message: `Error al intentar ejecutar Desbloqueo ${error}`,
                        icon: 'warning',
                        color: '#FF3D00',
                        colorText: '#FFF'
                    }
                    console.log(`Error ${error}`)
                });
            }
        }
    }
</script>