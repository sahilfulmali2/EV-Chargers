import { createApp } from 'vue'
import App from './App.vue';
import router from './router'
import VueGoogleMaps from 'vue-google-maps-community-fork'; 

const app =createApp(App);

app.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyAYILWWGH2_f8Mi3U7FB73P9fQjC5P4B-k',
    // libraries: 'places',
  },
});



app.use(router).mount('#app')
