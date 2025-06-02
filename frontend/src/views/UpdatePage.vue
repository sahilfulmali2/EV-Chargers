<template>
  <div class="update-page">
    <h1>Update Charging Station Information</h1>
    <form @submit.prevent="updateChargingStation">
      <div class="form-group">
        <label for="name">Charging Station Name</label>
        <input v-model="chargingStation.name" type="text" id="name" required />
      </div>

      <div class="form-group">
        <label for="location">Location</label>
        <input v-model="chargingStation.location" type="text" id="location" required />
      </div>

      <div class="form-group">
        <label for="latitude">Latitude</label>
        <input v-model="chargingStation.latitude" type="number" step="any" id="latitude" required />
      </div>

      <div class="form-group">
        <label for="longitude">Longitude</label>
        <input v-model="chargingStation.longitude" type="number" step="any" id="longitude" required />
      </div>

      <div class="form-group">
        <label for="status">Status</label>
        <select v-model="chargingStation.status" id="status" required>
          <option disabled value="">Select Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      <div class="form-group">
        <label for="power">Power Output</label>
        <select v-model="chargingStation.power" id="power" required>
          <option disabled value="">Select Power Output</option>
          <option value="5-10kW">5-10kW</option>
          <option value="10-50kW">10-50kW</option>
          <option value="50kW+">50kW+</option>
        </select>
      </div>

      <div class="form-group">
        <label for="connector">Connector Type</label>
        <select v-model="chargingStation.connector" id="connector" required>
          <option disabled value="">Select Connector Type</option>
          <option value="Type1">CCS Type 1</option>
          <option value="Type2">CCS Type 2</option>
          <option value="CHAdeMO">CHAdeMO</option>
          <option value="GB/T">GB/T</option>
        </select>
      </div>

      <button type="submit" class="btn">Update Station</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';

export default {
  name: 'UpdatePage',
  props: {
    stationId: String, // Assuming you pass the station ID as a prop
  },
  setup(props) {
    const chargingStation = ref({
      name: '',
      location: '',
      latitude: '',
      longitude: '',
      status: '',
      power: '',
      connector: '',
    });

    // Fetch the charging station data on component mount
    onMounted(async () => {
      try {
        const response = await axios.get(`https://ev-chargers-befi.onrender.com/api/chargers/${props.stationId}`);
        chargingStation.value = response.data;
      } catch (error) {
        console.error('Error fetching charging station data:', error);
      }
    });

    // Function to handle the update form submission
    const updateChargingStation = async () => {
      try {
        await axios.put(`https://ev-chargers-befi.onrender.com/api/chargers/${props.stationId}`, chargingStation.value);
        alert('Charging station updated successfully!');
      } catch (error) {
        console.error('Error updating charging station:', error);
        alert('Failed to update the charging station.');
      }
    };

    return {
      chargingStation,
      updateChargingStation,
    };
  },
};
</script>
