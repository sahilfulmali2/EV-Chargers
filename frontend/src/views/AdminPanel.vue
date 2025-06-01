<template>
  <div class="admin-panel">
    <h2>Admin Panel - Charging Stations</h2>
    <router-link to="/adminpanel/add">
      <button>Add New Charging Station</button>
    </router-link>

    <div v-if="chargingStations.length">
      <h3>All Charging Stations</h3>
      <ul>
        <li v-for="charger in chargingStations" :key="charger._id">
          <div>
            <span>{{ charger.name }} - {{ charger.location }} - {{ charger.status }}</span>
            <button @click="updateChargingStation(charger._id)">Update</button>
            <button @click="deleteChargingStation(charger._id)">Delete</button>
          </div>
        </li>
      </ul>
    </div>
    
    <div v-else>
      <p>No charging stations available</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import '../Styles/AdminPanel.css'


export default {
  data() {
    return {
      chargingStations: [],
    };
  },
  async created() {
    this.fetchChargingStations();
  },
  methods: {
    async fetchChargingStations() {
      try {
        const response = await axios.get('http://localhost:5000/api/chargers');
        this.chargingStations = response.data;
      } catch (err) {
        console.error("Error fetching stations:", err);
      }
    },
    async deleteChargingStation(id) {
      try {
        await axios.delete(`http://localhost:5000/api/chargers/${id}`);
        this.chargingStations = this.chargingStations.filter(c => c._id !== id);
        alert('Charging station deleted successfully!');
      } catch (err) {
        console.error("Error deleting station:", err);
      }
    },
    updateChargingStation(id) {
      this.$router.push(`/adminpanel/update/${id}`);
    },
  },
};
</script>
