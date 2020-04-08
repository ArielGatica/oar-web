<template>
    <v-container fluid grid-list-md text-xs-left>
        <v-layout row wrap align-center justify-center>
            <v-flex xs9 mt-11>
                <v-card>

                    <v-toolbar color="#005BFF" dark>
                        <v-toolbar-title class="headline">
                            <v-icon dark>vpn_key</v-icon> Privilegios
                        </v-toolbar-title>
                    </v-toolbar>

                    <v-data-table
                        v-model="selected"
                        show-select
                        single-select
                        :items="items"
                        :headers="headers">

                    </v-data-table>

                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        data:() =>({
            selected: [],
            items:[
                { name: 'Root', user: 'admin' },
                { name: 'test', user: 'test' }
            ],
            headers:[
                { text: 'Nombre', value: 'name' },
                { text: 'Usuario', value: 'user' }
            ]
        })
    }
</script>