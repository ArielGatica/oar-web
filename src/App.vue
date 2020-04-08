<template>
    <v-app style="background: #1D1E2E">
        <SideBar v-if="route !== 'Login'" />
        <Toolbar v-if="route !== 'Login'" />
        <v-content>
            <router-view></router-view>
        </v-content>
        <Footer v-if="route !== 'Login'" />
    </v-app>
</template>

<script>
    import SideBar from './components/SideBar';
    import Toolbar from './components/Toolbar';
    import Footer from './components/Footer';

    export default {
        name: "App",
        components: {
            SideBar,
            Toolbar,
            Footer
        },
        computed:{
            route(){
                return this.$route.name;
            }
        }
    };
</script>
