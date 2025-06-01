<template>
  <div class="map-wrapper">
    <GMapMap
      :center="mapCenter"
      :zoom="12"
      map-type-id="terrain"
      style="width: 700px; height: 500px"
    >
      <GMapMarker
        v-for="station in filteredStations"
        :key="station._id"
        :position="{ lat: station.latitude, lng: station.longitude }"
        :title="station.name"
        :clickable="true"
        @click="openInfoWindow(station)"
      />
      <GMapInfoWindow
        v-if="activeStation"
        :position="{
          lat: activeStation.latitude,
          lng: activeStation.longitude,
        }"
        :opened="infoWindowOpened"
        @closeclick="infoWindowOpened = false"
        :options="{ pixelOffset: { width: 0, height: -35 } }"
      >
        <div>
          <h4>{{ activeStation.name }}</h4>
          <p><strong>Location:</strong> {{ activeStation.location }}</p>
          <p><strong>Status:</strong> {{ activeStation.status }}</p>
          <p>
            <strong>Coords:</strong> {{ activeStation.latitude }},
            {{ activeStation.longitude }}
          </p>
        </div>
      </GMapInfoWindow>
    </GMapMap>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { onMounted,computed, watch} from "vue";
import axios from 'axios';

const props = defineProps({
  filters: Object,
});

const mapCenter = ref({ lat: 21.146633, lng: 79.08886 });
const stations = ref([]);
const activeStation = ref(null);
const infoWindowOpened = ref(false);

const fetchStations = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/chargers");
    if (!res) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.data;
    stations.value = data;

    if (data.length > 0) {
      mapCenter.value = { lat: data[0].latitude, lng: data[0].longitude };
    }
  } catch (error) {
    console.error("Failed to fetch stations:", error);
  }

};

const filteredStations = computed(() => {
  return stations.value.filter((station) => {
    const matchesStatus =
      !props.filters.status || station.status === props.filters.status;
    const matchesPower =
      !props.filters.power || station.power === props.filters.power;
    const matchesConnector =
      !props.filters.connector || station.connector === props.filters.connector;
    return matchesStatus && matchesPower && matchesConnector;
  });
});

const openInfoWindow = (station) => {
  activeStation.value = station;
  infoWindowOpened.value = true;
};

onMounted(() => {
  fetchStations();
});
</script>

