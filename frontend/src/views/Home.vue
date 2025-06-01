<template>
  <div id="container">
    <div id="lis">
      <h1>Filter Stations</h1>
      <div class="filter-group">
        <label for="status-filter">Status:</label>
        <select id="status-filter" v-model="selectedStatus">
          <option value="">All</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div class="filter-group">
        <label for="power-filter">Power Output:</label>
        <select id="power-filter" v-model="selectedPower">
          <option value="">All</option>
          <option value="7kW">5-10kW</option>
          <option value="22kW">10-50kW</option>
          <option value="50kW">50 kW+</option>
        </select>
      </div>

      <div class="filter-group">
        <label for="connector-filter">Connector Type:</label>
        <select id="connector-filter" v-model="selectedConnector">
          <option value="">All</option>
          <option value="Type1">CCS Type 1</option>
          <option value="Type2">CCS Type 2</option>
          <option value="CHAdeMO">CHAdeMO</option>
          <option value="GB/T">GB/T</option>
        </select>
      </div>

      <button @click="applyFilters" class="apply-button">Apply Filters</button>
    </div>
    <div id="app-container">
      <h1>Map</h1>
      <Map class="the-actual-map" 
      :filters="filters"/>
    </div>
  </div>
</template>

<script setup>
import Map from "../components/Map.vue";
import "../Styles/Home.css";
import {ref} from 'vue';

const selectedStatus = ref("");
const selectedPower = ref("");
const selectedConnector = ref("");

const filters = ref({});

function applyFilters (){
  filters.value = {
    status: selectedStatus.value,
    power: selectedPower.value,
    connector: selectedConnector.value
  };
}

</script>
