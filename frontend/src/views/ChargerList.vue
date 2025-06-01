<template>
  <div>
    <h2>Charging Stations</h2>
    <div>
      <div v-for="charger in chargers" :key="charger._id">
        <p>{{ charger.name }} ({{ charger.status }})</p>
      </div>
    </div>
  </div>
</template>

<script setup>

import { ref, onMounted } from 'vue'
import axios from 'axios'

const chargers = ref([])

onMounted(async () => {
  const token = localStorage.getItem("token")
  const response = await axios.get("http://localhost:5000/api/chargers", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  chargers.value = response.data
})
</script>
