package com.example.winecontrol

import android.os.Bundle
import android.view.LayoutInflater
import android.widget.LinearLayout
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.example.winecontrol.network.ApiClient
import com.example.winecontrol.network.SensorsApi
import com.example.winecontrol.session.Session
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class SensorsActivity : AppCompatActivity() {

    private lateinit var sensorContainer: LinearLayout
    private val sensorsApi = ApiClient.instance.create(SensorsApi::class.java)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_sensors)

        sensorContainer = findViewById(R.id.sensorContainer)

        CoroutineScope(Dispatchers.IO).launch {
            try {
                val response = sensorsApi.getAllSensors()
                val grouped = response.groupBy { "${it.container_name ?: "—"}||${it.container_location ?: "Невідома локація"}" }

                withContext(Dispatchers.Main) {
                    val inflater = LayoutInflater.from(this@SensorsActivity)
                    grouped.forEach { (key, sensors) ->
                        val (name, location) = key.split("||")

                        val groupView = inflater.inflate(R.layout.sensor_group, sensorContainer, false)
                        val tvGroupHeader = groupView.findViewById<TextView>(R.id.tvGroupHeader)
                        val groupList = groupView.findViewById<LinearLayout>(R.id.groupSensorsList)

                        tvGroupHeader.text = "$name — $location"

                        sensors.forEach { sensor ->
                            val sensorView = inflater.inflate(R.layout.sensor_card, groupList, false)
                            sensorView.findViewById<TextView>(R.id.tvSensorName).text = sensor.sensor_name
                            sensorView.findViewById<TextView>(R.id.tvSensorDetails).text =
                                "Тип: ${sensor.sensor_type} | Локація: ${sensor.location}"
                            groupList.addView(sensorView)
                        }

                        sensorContainer.addView(groupView)
                    }

                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }
}
