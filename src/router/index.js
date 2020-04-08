import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../components/Login';
import Dashboard from '../views/Dashboard';
import Nodos from '../views/Nodos';
import LogHistorico from '../views/LogHistorico';
import Registros from '../views/Registros';
import Monitores from '../views/Monitores';
import Callbacks from '../views/Callbacks';
import Privilegios from '../views/Privilegios';
import MonitorEvents from '../views/MonitorEvents';
import Analisis from '../views/Analisis';

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard
    },
    {
        path: '/nodos',
        name: 'Nodos',
        component: Nodos
    },
    {
        path: '/log-historico',
        name: 'Log Historico',
        component: LogHistorico
    },
    {
        path: '/registros',
        name: 'Registros',
        component: Registros
    },
    {
        path: '/monitores',
        name: 'Monitores',
        component: Monitores
    },
    {
        path: '/monitor-events',
        name: 'Eventos Monitor',
        component: MonitorEvents
    },
    {
        path: '/callbacks',
        name: 'Callbacks',
        component: Callbacks
    },
    {
        path: '/privilegios',
        name: 'Privilegios',
        component: Privilegios
    },
    {
        path: '/analisis',
        name: 'Analysis',
        component: Analisis
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
