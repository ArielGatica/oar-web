<template>
    <v-container>
        <v-row class="pl-12 pr-12 pt-5" justify="center" align="center">

            <!--CHILE MAP-->
            <v-col cols="12">
                <v-img  height="300" :src="mapaChile"></v-img>
            </v-col>

            <!--TABLES-->
            <v-col cols="6" class="pb-12">
                <v-data-table
                    hide-default-header
                    :items="regionesMapa"
                    :headers="headers"
                    items-per-page="5">
                </v-data-table>
            </v-col>

            <v-col cols="6" class="pb-12">
                <v-data-table
                    hide-default-header
                    :items="regionesMapa"
                    :headers="headers"
                    items-per-page="5">
                </v-data-table>
            </v-col>

            <!--
            <v-col cols="12" class="pb-12">
                <v-card height="315">
                    <v-row>
                        
                        <v-col cols="6">
                            <v-data-table
                                hide-default-header
                                :items="regionesMapa"
                                :headers="headers"
                                items-per-page="5">
                            </v-data-table>
                        </v-col>

                        
                        <v-col cols="6">
                            <v-img :src="mapaChile"></v-img>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
            -->

            <!--CHARTS-->
            <v-col v-for="item in chartData" :key="item.name" cols="4">
                <v-card class="mt-4 mx-auto">
                    <v-sheet
                        class="v-sheet--offset mx-auto"
                        :color="item.color"
                        elevation="12"
                        max-width="calc(100% - 32px)">
                        <v-sparkline 
                            :type="item.type" 
                            :labels="item.labels" 
                            :value="item.value" 
                            color="white" 
                            line-width="2" padding="16">
                        </v-sparkline>
                    </v-sheet>
                    <v-card-text class="pt-0">
                        <div class="title font-weight-light mb-2">{{item.name}}</div>
                        <div class="subheading font-weight-light grey--text">{{item.sub_label}}</div>
                        <v-divider class="my-2"></v-divider>
                        <v-icon class="mr-2" small>{{item.icon}}</v-icon>
                        <span class="caption grey--text font-weight-light">Última actualización hace: {{item.update_time}}</span>
                    </v-card-text>
                </v-card>                
            </v-col>

            <!--TOTAL BOX-->
            <v-col class="pt-10 pl-6 pr-6 pb-12" cols="3" v-for="item in totalBox" :key="item.name">
                <v-card class="mt-4 mx-auto" :color="item.color">
                    <v-card-title class="pt-3">
                        <v-flex xs6>
                            <v-icon color="white" class="pl-6" size="60">{{item.icon}}</v-icon>
                        </v-flex>
                        <v-flex xs6>
                            <div align="right" class="title font-weight-light mb-2">{{item.name}}</div>
                            <h3 align="right" class="display-1">{{item.data}}</h3>
                        </v-flex>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-actions>
                        <v-btn icon>
                            <v-icon>refresh</v-icon>
                        </v-btn>
                        <v-spacer></v-spacer>
                       <span class="caption font-weight-light">Update</span>
                    </v-card-actions>
                </v-card>
            </v-col>

        </v-row>
    </v-container>
</template>

<script>
    import MapChileSvg from '../components/MapChileSvg';

    export default {
        name: 'Dashboard',
        components:{
            MapChileSvg
        },
        data: () => ({
            mapaChile: require('../assets/mapaChile2.png'),
            chartData:[
                {
                    labels: ["Lun", "Mar", "Mier", "Jue", "Vie", "Sab", "Dom"],
                    value: [445,19,300,154,556,16,77],
                    type: 'trend',
                    color: 'teal',
                    name: 'Nodos',
                    sub_label: 'Días de contingencia',
                    icon: 'sync',
                    update_time: '1 Día'
                },
                {   
                    labels: ['Ja', 'Fe', 'Ma', 'Ap', 'Mai', 'Ju', 'Jul', 'Au', 'Se', 'Oc', 'No', 'De'],  
                    value: [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 150],
                    type: 'bar',
                    color: 'pink',
                    name: 'Meses',
                    sub_label: 'Traza de fallos',
                    icon: 'event_note',
                    update_time: '1 Mes'
                },
                {
                    labels: ["12am", "3am", "6am", "9am", "12pm", "3pm", "6pm", "9pm"],
                    value: [200, 675, 410, 390, 310, 460, 250, 240],
                    type: 'trend',
                    color: 'cyan',
                    name: 'Registros',
                    sub_label: 'Por horas',
                    icon: 'access_time',
                    update_time: '24 hrs.'
                }
            ],
            totalBox:[
                { data: 145, name: 'Nodos', icon: 'public', color: 'primary' },
                { data: 1, name: 'OK', icon: 'check_circle', color: 'success' },
                { data: 8, name: 'NOK', icon: 'cancel', color: 'error' }, 
                { data: 9, name: 'Total', icon: 'insert_chart_outlined', color: 'orange' }
            ],
            headers: [
                { text: 'Región', value: 'region' },
                { text: 'Contingencia', value: 'contingencia' }
            ],
            regionesMapa: [
                {
                    region: "Arica y Parinacota (XV)",
                    contingencia: 159
                },
                {
                    region: "Tarapacá (I)",
                    contingencia: 159
                },
                {
                    region: "Antofagasta (II)",
                    contingencia: 237
                },
                {
                    region: "Atacama (III)",
                    contingencia: 262
                },
                {
                    region: "Coquimbo (IV)",
                    contingencia: 305
                },
                {
                    region: "Valparaíso (V)",
                    contingencia: 356
                },
                {
                    region: "Metropolitana (RM)",
                    contingencia: 375
                },
                {
                    region: "O'Higgins (VI)",
                    contingencia: 392
                },
                {
                    region: "Maule (VII)",
                    contingencia: 408
                },
                {
                    region: "Bío-Bío (VIII)",
                    contingencia: 452
                },
                {
                    region: "Araucanía (IX)",
                    contingencia: 518
                },
                {
                    region: 'Los Ríos (XIV)',
                    contingencia: 15
                },
                {
                    region: 'Los Lagos (X)',
                    contingencia: 789
                },
                {
                    region: 'Aysén (XI)',
                    contingencia: 435
                },
                {
                    region: 'Magallanes (XII)',
                    contingencia: 159
                }
            ]
        })
    };
</script>

<style>
    .v-sheet--offset {
        top: -24px;
        position: relative;
    }
</style>