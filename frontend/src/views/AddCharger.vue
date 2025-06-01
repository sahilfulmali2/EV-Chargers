<template>
  <div class="add-charger">
    <h2>Add New Charging Station</h2>
    <form @submit.prevent="addChargingStation">
      <input v-model="charger.name" placeholder="Name" required />
      <input v-model="charger.location" placeholder="Location" required />
      <input
        v-model="charger.latitude"
        placeholder="Latitude"
        required
        type="number"
        step="any"
      />
      <input
        v-model="charger.longitude"
        placeholder="Longitude"
        required
        type="number"
        step="any"
      />
      <select v-model="charger.status" required>
        <option disabled value="">Select Status</option>
        <option>Active</option>
        <option>Inactive</option>
      </select>
      <select v-model="charger.power" required>
        <option disabled value="">Select Power Output</option>
        <option value="7kW">5-10kW</option>
        <option value="22kW">10-50kW</option>
        <option value="50kW">50 kW+</option></select
      ><select v-model="charger.connector" required>
        <option disabled value="">Select Connector Type</option>
        <option value="Type1">CCS Type 1</option>
        <option value="Type2">CCS Type 2</option>
        <option value="CHAdeMO">CHAdeMO</option>
        <option value="GB/T">GB/T</option>
      </select>
      <button type="submit">Add</button>
      <router-link to="/adminpanel"
        ><button type="button">Cancel</button></router-link
      >
    </form>
  </div>
</template>

<script>
import axios from "axios";
import "../Styles/AddPage.css";

export default {
  data() {
    return {
      charger: {
        name: "",
        location: "",
        latitude: "",
        longitude: "",
        status: "",
        power: "",
        connector: "",
      },
    };
  },
  methods: {
    async addChargingStation() {
      try {
        console.log("Sending charger data:", this.charger);

        await axios.post("http://localhost:5000/api/chargers", this.charger);
        this.$router.push("/adminpanel");
      } catch (err) {
        console.error("Error adding station:", err);
      }
    },
  },
};
</script>
