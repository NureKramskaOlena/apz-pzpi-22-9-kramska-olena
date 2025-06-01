package com.example.winecontrol.network

import com.example.winecontrol.network.models.Sensor
import retrofit2.http.GET

interface SensorsApi {
    @GET("sensors")
    suspend fun getAllSensors(): List<Sensor>
}
