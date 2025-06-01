package com.example.winecontrol

import android.graphics.Color
import android.graphics.Typeface
import android.os.Bundle
import android.util.Log
import android.view.Gravity
import android.view.ViewGroup
import android.widget.*
import android.app.Dialog
import androidx.appcompat.app.AppCompatActivity
import androidx.cardview.widget.CardView
import com.example.winecontrol.network.*
import kotlinx.coroutines.*

class ReportsActivity : AppCompatActivity() {

    private lateinit var reportLayout: LinearLayout
    private val reportsApi = ApiClient.instance.create(ReportsApi::class.java)
    private val containersApi = ApiClient.instance.create(ContainersApi::class.java)
    private val recipesApi = ApiClient.instance.create(RecipesApi::class.java)

    private var recipes: List<Recipe> = emptyList()
    private var containers: List<Container> = emptyList()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_reports)

        reportLayout = findViewById(R.id.reportLayout)

        val btnAddReport = findViewById<Button>(R.id.btnAddReport)
        btnAddReport.setOnClickListener {
            showAddReportDialog()
        }

        loadReports()
    }

    private fun showAddReportDialog() {
        CoroutineScope(Dispatchers.IO).launch {
            recipes = recipesApi.getAll()
            containers = containersApi.getAllContainers()

            withContext(Dispatchers.Main) {
                val dialogView = layoutInflater.inflate(R.layout.dialog_add_report, null)
                val dialog = Dialog(this@ReportsActivity)
                dialog.setContentView(dialogView)

                val inputName = dialogView.findViewById<EditText>(R.id.inputReportName)
                val inputContent = dialogView.findViewById<EditText>(R.id.inputReportContent)
                val recipeSpinner = dialogView.findViewById<Spinner>(R.id.recipeSpinner)
                val containerSpinner = dialogView.findViewById<Spinner>(R.id.containerSpinner)
                val btnSave = dialogView.findViewById<Button>(R.id.btnSave)
                val btnCancel = dialogView.findViewById<Button>(R.id.btnCancel)

                recipeSpinner.adapter = ArrayAdapter(
                    this@ReportsActivity,
                    R.layout.spinner_item_white,
                    recipes.map { it.name }
                ).also {
                    it.setDropDownViewResource(R.layout.spinner_dropdown_white)
                }

                containerSpinner.adapter = ArrayAdapter(
                    this@ReportsActivity,
                    R.layout.spinner_item_white,
                    containers.map { "${it.name} — ${it.location}" }
                ).also {
                    it.setDropDownViewResource(R.layout.spinner_dropdown_white)
                }

                btnCancel.setOnClickListener { dialog.dismiss() }

                btnSave.setOnClickListener {
                    val name = inputName.text.toString().trim()
                    val content = inputContent.text.toString().trim()
                    val recipeIndex = recipeSpinner.selectedItemPosition
                    val containerIndex = containerSpinner.selectedItemPosition

                    if (name.isNotEmpty() && content.isNotEmpty() && recipeIndex >= 0 && containerIndex >= 0) {
                        val recipeId = recipes[recipeIndex].recipe_id
                        val containerId = containers[containerIndex].container_id
                        val hardcodedUserId = 18 // 🔥 перманентно

                        Log.d("REPORTS_DEBUG", "Перед створенням: name=$name, content=$content, userId=$hardcodedUserId")

                        addReport(name, content, recipeId, containerId, hardcodedUserId)
                        dialog.dismiss()
                    } else {
                        Toast.makeText(this@ReportsActivity, "Будь ласка, заповніть усі поля", Toast.LENGTH_SHORT).show()
                    }
                }

                dialog.window?.setBackgroundDrawableResource(android.R.color.transparent)
                dialog.window?.setLayout(
                    (resources.displayMetrics.widthPixels * 0.9).toInt(),
                    ViewGroup.LayoutParams.WRAP_CONTENT
                )
                dialog.show()
            }
        }
    }

    private fun addReport(name: String, content: String, recipeId: Int, containerId: Int, userId: Int) {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val newReport = ReportRequest(name, content, recipeId, containerId, userId)
                reportsApi.addReport(newReport)

                withContext(Dispatchers.Main) {
                    Toast.makeText(this@ReportsActivity, "Звіт створено!", Toast.LENGTH_SHORT).show()
                    loadReports()
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    Toast.makeText(this@ReportsActivity, "Помилка при створенні", Toast.LENGTH_SHORT).show()
                }
                e.printStackTrace()
            }
        }
    }

    private fun deleteReport(reportId: Int) {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                reportsApi.deleteReport(reportId)
                withContext(Dispatchers.Main) {
                    Toast.makeText(this@ReportsActivity, "Звіт видалено", Toast.LENGTH_SHORT).show()
                    loadReports()
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    Toast.makeText(this@ReportsActivity, "Помилка при видаленні", Toast.LENGTH_SHORT).show()
                }
                e.printStackTrace()
            }
        }
    }

    private fun loadReports() {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val reports = reportsApi.getAllReports()

                withContext(Dispatchers.Main) {
                    reportLayout.removeAllViews()

                    reports.forEach { report ->
                        val card = CardView(this@ReportsActivity).apply {
                            radius = 12f
                            setContentPadding(24, 24, 24, 24)
                            setCardBackgroundColor(Color.TRANSPARENT)
                            cardElevation = 0f
                            useCompatPadding = true
                            layoutParams = LinearLayout.LayoutParams(
                                LinearLayout.LayoutParams.MATCH_PARENT,
                                LinearLayout.LayoutParams.WRAP_CONTENT
                            ).apply { bottomMargin = 20 }
                        }

                        val border = LinearLayout(this@ReportsActivity).apply {
                            orientation = LinearLayout.VERTICAL
                            setPadding(24, 24, 24, 24)
                            setBackgroundResource(R.drawable.sharp_button)
                        }

                        val nameText = TextView(this@ReportsActivity).apply {
                            text = "📄 ${report.name}"
                            setTextColor(Color.WHITE)
                            setTypeface(null, Typeface.BOLD)
                        }

                        val recipeText = TextView(this@ReportsActivity).apply {
                            text = "Рецепт: ${report.recipe_name ?: "Невідомо"}"
                            setTextColor(Color.LTGRAY)
                        }

                        val containerText = TextView(this@ReportsActivity).apply {
                            text = "Контейнер: ${report.container_name} — ${report.container_location} (об’єм: ${report.capacity})"
                            setTextColor(Color.LTGRAY)
                        }

                        val dateText = TextView(this@ReportsActivity).apply {
                            text = "Створено: ${report.created_at}"
                            setTextColor(Color.GRAY)
                        }

                        val contentText = TextView(this@ReportsActivity).apply {
                            text = report.content
                            setTextColor(Color.WHITE)
                        }

                        val deleteBtn = Button(this@ReportsActivity).apply {
                            text = "Видалити"
                            setPadding(24, 8, 24, 8)
                            setBackgroundResource(R.drawable.outline_button)
                            setTextColor(Color.WHITE)
                            setOnClickListener { deleteReport(report.report_id) }
                        }

                        val buttonLayout = LinearLayout(this@ReportsActivity).apply {
                            orientation = LinearLayout.HORIZONTAL
                            gravity = Gravity.END
                            addView(deleteBtn)
                        }

                        border.apply {
                            addView(nameText)
                            addView(recipeText)
                            addView(containerText)
                            addView(dateText)
                            addView(contentText)
                            addView(buttonLayout)
                        }

                        card.addView(border)
                        reportLayout.addView(card)
                    }
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }
}
