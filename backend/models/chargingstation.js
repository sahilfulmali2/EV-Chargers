const mongoose = require('mongoose');

const ChargingStationSchema = new mongoose.Schema({
  name: String,
  location: String,
  latitude: Number,
  longitude: Number,
  status: String,
  power: String,
  connector: String,

});

module.exports = mongoose.model('ChargingStation', ChargingStationSchema);
