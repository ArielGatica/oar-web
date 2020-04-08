<template>
  <v-container fluid class="fill-height">
        <v-row justify="center" align="center">

            <v-col cols="12" sm="10">
                <v-card color="#26293C">
                    <MapChileSvg/>
                </v-card>
            </v-col>
            
            <v-col cols="12" sm="3">
                <v-flex xs10>
                    <v-card class="elevation-2" color="#26293C">
                        <v-card-title>
                            <v-flex xs6>
                                <v-icon class="orange--text" size="80">insert_chart_outlined</v-icon>
                            </v-flex>
                            <v-flex xs6 class="text-xs-right">
                                <h3 class="display-2" style="color: #898A9C">{{total}}</h3>
                                <h6 class="caption text--lighten-1" style="color: #898A9C">TOTAL MONITOREOS REALIZADOS</h6>
                            </v-flex>
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-card-actions>
                            <div class="body-1 text--lighten-1" style="color: #898A9C">ÚLTIMAS 24 HRS.</div>
                        </v-card-actions>
                    </v-card>
                </v-flex>
            </v-col>
               
            <v-col cols="12" sm="3">
                <v-flex xs10>
                    <v-card class="elevation-2" color="#26293C">
                        <v-card-title>
                            <v-flex xs6>
                                <v-icon class="blue--text" size="80">public</v-icon>
                            </v-flex>
                            <v-flex xs6 class="text-xs-right">
                                <h3 class="display-2" style="color: #898A9C">{{nodos}}</h3>
                                <h6 class="caption text--lighten-1" style="color: #898A9C">TOTAL NODOS MONITOREADOS</h6>
                            </v-flex>
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-card-actions>
                            <div class="body-1 text--lighten-1" style="color: #898A9C">ÚLTIMAS 24 HRS.</div>
                        </v-card-actions>
                    </v-card>
                </v-flex>
            </v-col>

            <v-col cols="12" sm="3">
                <v-flex xs10>
                    <v-card class="elevation-2" color="#26293C">
                        <v-card-title>
                            <v-flex xs6>
                                <v-icon class="green--text" size="80">check_circle</v-icon>
                            </v-flex>
                            <v-flex xs6 class="text-xs-right">
                                <h3 class="display-2" style="color: #898A9C">{{ok}}</h3>
                                <h6 class="caption text--lighten-1" style="color: #898A9C">TOTAL MONITOREOS OK</h6>
                            </v-flex>
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-card-actions>
                            <div class="body-1 text--lighten-1" style="color: #898A9C">ÚLTIMAS 24 HRS.</div>
                        </v-card-actions>
                    </v-card>
                </v-flex>
            </v-col>

            <v-col cols="12" sm="3">
                <v-flex xs10>
                    <v-card class="elevation-2" color="#26293C">
                        <v-card-title>
                            <v-flex xs6>
                                <v-icon class="red--text" size="80">cancel</v-icon>
                            </v-flex>
                            <v-flex xs6 class="text-xs-right">
                                <h3 class="display-2" style="color: #898A9C">{{nok}}</h3>
                                <h6 class="caption text--lighten-1" style="color: #898A9C">TOTAL MONITOREOS NOK</h6>
                            </v-flex>
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-card-actions>
                            <div class="body-1 text--lighten-1" style="color: #898A9C">ÚLTIMAS 24 HRS.</div>
                        </v-card-actions>
                    </v-card>
                </v-flex>
            </v-col>

            <v-col cols="12" sm="12">
                <v-sparkline
                    :gradient="gradient"
                    :line-width="width"
                    :padding="padding"
                    :smooth="radius || false"
                    :value="value"
                    auto-draw
                ></v-sparkline>
            </v-col>

        </v-row>

  </v-container>
</template>

<script>
    import axios from 'axios';
    import { environments } from '../environments/environments';
    import MapChileSvg from './components/MapChileSvg';

    const gradients = [
        ['#222'],
        ['#42b3f4'],
        ['red', 'orange', 'yellow'],
        ['purple', 'violet'],
        ['#00c6ff', '#F0F', '#FF0'],
        ['#f72047', '#ffd200', '#1feaea'],
    ]

    export default {
        components:{
            MapChileSvg
        },
        data:() =>({
            ok: '',
            nok: '',
            nodos: '',
            total : '',
            fill: true,
            gradient: gradients[4],
            gradients,
            padding: 8,
            radius: 10,
            value: [0, 2, 5, 9, 5, 10, 3, 5, 0, 0, 1, 8, 2, 9, 0],
            width: 2,
            
        }),
        beforeMount(){
            let self = this;

            async function getDataDashboard(){
                try {
                    const readDashboard = await axios.get(`${environments.API_KPI_DASHBOARD}dashboard`)
                    if(readDashboard)
                        return readDashboard
                } catch (error) {
                    return error;
                }
            }
            getDataDashboard().then((response) =>{
                if(response.status == 200){
                    self.nodos = response.data[0].cantidadNodos;
                    self.ok = response.data[1].totalok;
                    self.nok = response.data[2].totalnok
                    self.total = response.data[3].total;
                }
            })
            .catch((error) => { console.log(`Error al intentar obtener registros dashboard: ${error}`) });
        }
    }
</script>