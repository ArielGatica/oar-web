<template>
    <v-app-bar
        height="73"
        app
        elevation="0"
        color="#1D1E2E">

        <v-spacer></v-spacer>

        <v-menu
            bottom 
            offset-y 
            transition="slide-y-transition">
            <template v-slot:activator="{ on }">
                <v-btn v-on="on" icon>
                    <v-badge color="pink" overlap>
                        <template v-slot:badge>
                            <span v-if="countMonitorFail > 0">{{ countMonitorFail }}</span>
                        </template>            
                        <v-icon color="#898A9C">notifications</v-icon>
                    </v-badge>
                </v-btn>
            </template>

            <v-list>
                <v-list-item
                    v-for="(item, index) in notifications"
                    :key="index"
                    to="/monitor-events">
                    <v-list-item-title>{{ item }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>

        <v-menu bottom offset-y>
            <template v-slot:activator="{ on }">
                <v-btn v-on="on" icon>
                    <v-icon color="#898A9C">exit_to_app</v-icon>
                </v-btn>
            </template>

            <v-list>
                <v-list-item
                    v-for="(item, index) in settings"
                    :key="index"
                    @click="setting(item.action)">
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>

    </v-app-bar>
</template>

<script>
    import axios from 'axios';
    import { environments } from '../environments/environments';

    export default {
        data:() =>({
            settings: [
                { title: "Salir", action: "logout" }
            ],
            notifications:[],
            countMonitorFail: 3
        }),
        beforeMount(){
            let self = this;

            async function getMonitorFail(){
                try {
                    const readMonitorFail = await axios.get(`${environments.API_KPI_MONITOR}/Monitors?filter=%7B%22where%22%3A%20%7B%20%22estado%22%3A%20%220%22%7D%7D`)
                    if(readMonitorFail)
                        return readMonitorFail;
                } catch (error) {
                    return error;
                }
            }
            getMonitorFail().then((response) =>{
                if(response.status == 200){
                    self.countMonitorFail = response.data.length;

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

                            let salidaNoti = []
                            response.data.forEach((value) =>{
                                salidaNoti.push({
                                    "Monitor" :`${groupByIdKpis[value.idKpi][0]['nombre']} asociado al Nodo: ${groupByIdNodos[value.idNodo][0]['nodo']}`
                                })
                            })

                            self.notifications = salidaNoti;
                            console.log(JSON.stringify(salidaNoti))
                        })
                    })
                }
            })
            .catch((error) => {`Error ${error}`} );
        },
        methods: {
            setting: action => {
                if (action == "logout")
                    window.location.replace("/");
            }
        }
    }
</script>