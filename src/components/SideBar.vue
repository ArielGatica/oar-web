<template>
    <v-navigation-drawer
        app 
        persistent
        dark
        width="260"
        color="rgba(16, 22, 58, 0.97)"
        expand-on-hover
        mini-variant>

        <template v-slot:prepend>
            <v-list nav class="py-0">
                <v-list-item two-line class="px-0">
                    <v-list-item-avatar>
                        <v-img :src="logoEntel"></v-img>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title class="bold ml-5 mt-3" style="color: #01E9B9">OAR</v-list-item-title>
                        <v-list-item-subtitle class="bold ml-5" style="color: #01E9B9">ENTEL</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </template>
        <br/>

        <v-list nav>
            <v-list-item 
                to="/dashboard"
                color="#01E9B2">
                <v-list-item-icon>
                    <v-icon>dashboard</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                    <v-list-item-title>Dashboard</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list nav>
            <v-list-item 
                v-for="item in subItemSide"
                :key="item.title"
                :to="item.path"
                color="#01E9B2">
                <v-list-item-icon>
                    <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list nav>
            <v-list-group
                v-for="item in itemsToSide"
                :key="item.title"
                :prepend-icon="item.icon"
                no-action
                color="#01E9B2">

                <template v-slot:activator>
                    <v-list-item-content>
                        <v-list-item-title v-text="item.title"></v-list-item-title>
                    </v-list-item-content>
                </template>

                <v-list-item
                    v-for="subItem in item.items"
                    :key="subItem.title"
                    :to="subItem.path">
                <v-list-item-content>
                    <v-list-item-title v-text="subItem.title"></v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

            </v-list-group>
        </v-list>

    </v-navigation-drawer>
</template>
 
<script>
    export default {
        data() {
            return {
                logoEntel: require("../assets/logo-entel.png"),
                drawer: true,
                subItemSide: [
                    { title: "Monitor Eventos", icon: "tv", path: "/monitor-events" },
                    { title: "Log Histórico", icon: "description", path: "/log-historico" },
                    { title: "Análisis", icon: "bar_chart", path: "/analisis" }
                ],
                itemsToSide: [
                    {
                        title: "Mantenedores", icon: 'settings', items:[
                            { title: "Monitores", icon: "speed", path: "/monitores" },
                            { title: "Nodos", icon: "public", path: "/nodos" },
                            { title: "Privilegios", icon: "vpn_key", path: "/privilegios" }
                        ]
                    }
                ]
            };
        }
    };
</script>

