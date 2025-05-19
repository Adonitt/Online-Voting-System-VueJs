// import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './assets/css/bootstrap.min.css';
import './assets/css/demo.css';
import './assets/css/fonts.css';
import './assets/css/kaiadmin.css';
import './assets/css/plugins.css';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
// import './assets/js/plugin/kaiadmin.js';
// import './assets/js/plugin/setting-demo.js'; // or setting-demo2.js depending on which one you use
// import './assets/js/plugin/demo.js';


import {createApp} from 'vue'
import App from './App.vue'
import {createPinia} from "pinia";

createApp(App)
    .use(createPinia())
    .mount('#app')