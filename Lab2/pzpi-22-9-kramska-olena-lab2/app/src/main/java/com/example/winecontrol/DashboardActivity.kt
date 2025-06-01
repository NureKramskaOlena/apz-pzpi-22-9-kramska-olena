package com.example.winecontrol

import android.content.Intent
import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity

class DashboardActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_dashboard)

        val tvUserName = findViewById<TextView>(R.id.tvUserName)
        val btnLogout = findViewById<Button>(R.id.btnLogout)
        val btnRecipes = findViewById<Button>(R.id.btnRecipes)
        val btnReports = findViewById<Button>(R.id.btnReports)
        val btnSensors = findViewById<Button>(R.id.btnSensors)
        val btnContainers = findViewById<Button>(R.id.btnContainers)
        val userId = intent.getIntExtra("user_id", -1)

        // Отримуємо ім’я з LoginActivity
        val username = intent.getStringExtra("username") ?: "Користувач"
        findViewById<TextView>(R.id.tvUserName).text = "👤 $username"



        btnLogout.setOnClickListener {
            startActivity(Intent(this, LoginActivity::class.java))
            finish()
        }

        btnRecipes.setOnClickListener {
            Toast.makeText(this, "Переходимо до Рецептів", Toast.LENGTH_SHORT).show()
            startActivity(Intent(this, RecipesActivity::class.java)) // коли буде створено
        }

        btnReports.setOnClickListener {
            Toast.makeText(this, "Переходимо до Звітів", Toast.LENGTH_SHORT).show()
            startActivity(Intent(this, ReportsActivity::class.java))
        }

        btnSensors.setOnClickListener {
            Toast.makeText(this, "Переходимо до Сенсорів", Toast.LENGTH_SHORT).show()
            startActivity(Intent(this, SensorsActivity::class.java))
        }

        btnContainers.setOnClickListener {
            Toast.makeText(this, "Переходимо до Ємностей", Toast.LENGTH_SHORT).show()
            startActivity(Intent(this, ContainersActivity::class.java))
        }
    }
}
