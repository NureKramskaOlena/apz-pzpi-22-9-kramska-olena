package com.example.winecontrol

import android.graphics.Color
import android.graphics.Typeface
import android.os.Bundle
import android.util.TypedValue
import android.view.Gravity
import android.view.ViewGroup
import android.widget.*
import android.app.Dialog
import androidx.appcompat.app.AppCompatActivity
import androidx.cardview.widget.CardView
import com.example.winecontrol.network.ApiClient
import com.example.winecontrol.network.Container
import com.example.winecontrol.network.ContainersApi
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class ContainersActivity : AppCompatActivity() {

    private lateinit var containerLayout: LinearLayout
    private val containersApi = ApiClient.instance.create(ContainersApi::class.java)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_containers)

        containerLayout = findViewById(R.id.containerLayout)

        val btnAddContainer = findViewById<Button>(R.id.btnAddContainer)
        btnAddContainer.setOnClickListener {
            showAddContainerDialog()
        }

        loadContainers()
    }

    private fun showAddContainerDialog() {
        val dialogView = layoutInflater.inflate(R.layout.dialog_add_container, null)
        val dialog = Dialog(this)
        dialog.setContentView(dialogView)

        val nameInput = dialogView.findViewById<EditText>(R.id.inputName)
        val locationInput = dialogView.findViewById<EditText>(R.id.inputLocation)
        val capacityInput = dialogView.findViewById<EditText>(R.id.inputCapacity)
        val btnSave = dialogView.findViewById<Button>(R.id.btnSave)
        val btnCancel = dialogView.findViewById<Button>(R.id.btnCancel)

        btnCancel.setOnClickListener { dialog.dismiss() }

        btnSave.setOnClickListener {
            val name = nameInput.text.toString().trim()
            val location = locationInput.text.toString().trim()
            val capacity = capacityInput.text.toString().toFloatOrNull() ?: 0f

            if (name.isNotEmpty() && location.isNotEmpty() && capacity > 0) {
                addContainer(name, location, capacity)
                dialog.dismiss()
            } else {
                Toast.makeText(this, "Будь ласка, заповніть всі поля", Toast.LENGTH_SHORT).show()
            }
        }

        dialog.window?.setBackgroundDrawableResource(android.R.color.transparent)
        dialog.show()
    }

    private fun showEditContainerDialog(container: Container) {
        val dialogView = layoutInflater.inflate(R.layout.dialog_add_container, null)
        val dialog = Dialog(this)
        dialog.setContentView(dialogView)

        val nameInput = dialogView.findViewById<EditText>(R.id.inputName)
        val locationInput = dialogView.findViewById<EditText>(R.id.inputLocation)
        val capacityInput = dialogView.findViewById<EditText>(R.id.inputCapacity)
        val btnSave = dialogView.findViewById<Button>(R.id.btnSave)
        val btnCancel = dialogView.findViewById<Button>(R.id.btnCancel)

        // Підставити дані
        nameInput.setText(container.name)
        locationInput.setText(container.location)
        capacityInput.setText(container.capacity.toString())

        btnCancel.setOnClickListener { dialog.dismiss() }

        btnSave.setOnClickListener {
            val name = nameInput.text.toString().trim()
            val location = locationInput.text.toString().trim()
            val capacity = capacityInput.text.toString().toFloatOrNull() ?: 0f

            if (name.isNotEmpty() && location.isNotEmpty() && capacity > 0) {
                updateContainer(container.container_id, name, location, capacity)
                dialog.dismiss()
            } else {
                Toast.makeText(this, "Будь ласка, заповніть всі поля", Toast.LENGTH_SHORT).show()
            }
        }

        dialog.window?.setBackgroundDrawableResource(android.R.color.transparent)
        dialog.window?.setLayout(
            (resources.displayMetrics.widthPixels * 0.9).toInt(),
            ViewGroup.LayoutParams.WRAP_CONTENT
        )
        dialog.show()
    }

    private fun addContainer(name: String, location: String, capacity: Float) {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val newContainer = Container(
                    container_id = 0, // обов’язкове поле якщо не використовуєш окремий DTO
                    name = name,
                    location = location,
                    capacity = capacity
                )

                containersApi.addContainer(newContainer)

                withContext(Dispatchers.Main) {
                    Toast.makeText(this@ContainersActivity, "Ємність додано!", Toast.LENGTH_SHORT).show()
                    loadContainers()
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    Toast.makeText(this@ContainersActivity, "Помилка при додаванні", Toast.LENGTH_SHORT).show()
                }
                e.printStackTrace()
            }
        }
    }

    private fun updateContainer(id: Int, name: String, location: String, capacity: Float) {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val updated = Container(id, name, location, capacity)
                containersApi.updateContainer(id, updated)

                withContext(Dispatchers.Main) {
                    Toast.makeText(this@ContainersActivity, "Ємність оновлено!", Toast.LENGTH_SHORT).show()
                    loadContainers()
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    Toast.makeText(this@ContainersActivity, "Помилка при оновленні", Toast.LENGTH_SHORT).show()
                }
                e.printStackTrace()
            }
        }
    }

    private fun deleteContainer(containerId: Int) {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                containersApi.deleteContainer(containerId)

                withContext(Dispatchers.Main) {
                    Toast.makeText(this@ContainersActivity, "Ємність видалено", Toast.LENGTH_SHORT).show()
                    loadContainers()
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    Toast.makeText(this@ContainersActivity, "Помилка при видаленні", Toast.LENGTH_SHORT).show()
                }
                e.printStackTrace()
            }
        }
    }


    private fun loadContainers() {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val containers = containersApi.getAllContainers()
                val grouped = containers.groupBy { it.location ?: "—" }

                withContext(Dispatchers.Main) {
                    containerLayout.removeAllViews()

                    grouped.forEach { (location, list) ->
                        val locationTitle = TextView(this@ContainersActivity).apply {
                            text = "📍 Локація: $location"
                            setTextColor(Color.parseColor("#FFD700"))
                            setTextSize(TypedValue.COMPLEX_UNIT_SP, 18f)
                            setTypeface(null, Typeface.BOLD)
                            setPadding(0, 24, 0, 16)
                        }
                        containerLayout.addView(locationTitle)

                        list.forEach { container ->
                            val card = CardView(this@ContainersActivity).apply {
                                radius = 12f
                                setContentPadding(24, 24, 24, 24)
                                setCardBackgroundColor(Color.TRANSPARENT)
                                cardElevation = 0f
                                useCompatPadding = true
                                layoutParams = LinearLayout.LayoutParams(
                                    LinearLayout.LayoutParams.MATCH_PARENT,
                                    LinearLayout.LayoutParams.WRAP_CONTENT
                                ).apply {
                                    bottomMargin = 20
                                }
                            }

                            val border = LinearLayout(this@ContainersActivity).apply {
                                orientation = LinearLayout.VERTICAL
                                setPadding(24, 24, 24, 24)
                                setBackgroundResource(R.drawable.sharp_button)
                            }

                            val nameText = TextView(this@ContainersActivity).apply {
                                text = "Ємність ${container.name}"
                                setTextColor(Color.WHITE)
                                setTypeface(null, Typeface.BOLD)
                            }

                            val capacityText = TextView(this@ContainersActivity).apply {
                                text = "Об’єм: ${container.capacity}"
                                setTextColor(Color.LTGRAY)
                            }

                            val buttonLayout = LinearLayout(this@ContainersActivity).apply {
                                orientation = LinearLayout.HORIZONTAL
                                gravity = Gravity.END

                                val editBtn = Button(context).apply {
                                    text = "Редагувати"
                                    setPadding(24, 8, 24, 8)
                                    setBackgroundResource(R.drawable.outline_button)
                                    setTextColor(Color.WHITE)

                                    setOnClickListener {
                                        showEditContainerDialog(container)
                                    }
                                }


                                val deleteBtn = Button(context).apply {
                                    text = "Видалити"
                                    setPadding(24, 8, 24, 8)
                                    setBackgroundResource(R.drawable.outline_button)
                                    setTextColor(Color.WHITE)

                                    setOnClickListener {
                                        deleteContainer(container.container_id)
                                    }
                                }


                                val params = LinearLayout.LayoutParams(
                                    ViewGroup.LayoutParams.WRAP_CONTENT,
                                    ViewGroup.LayoutParams.WRAP_CONTENT
                                ).apply {
                                    marginStart = 20
                                }

                                addView(editBtn)
                                addView(deleteBtn, params)
                            }

                            border.addView(nameText)
                            border.addView(capacityText)
                            border.addView(buttonLayout)

                            card.addView(border)
                            containerLayout.addView(card)
                        }
                    }
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }
}
