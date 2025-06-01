package com.example.winecontrol.network.models

data class Sensor(
    val sensor_id: Int,
    val sensor_name: String,
    val sensor_type: String,
    val location: String,
    val container_name: String?,
    val container_location: String?
)
