package com.example.winecontrol

import android.os.Bundle
import android.view.LayoutInflater
import android.widget.LinearLayout
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.example.winecontrol.network.ApiClient
import com.example.winecontrol.network.RecipesApi
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class RecipesActivity : AppCompatActivity() {

    private lateinit var layout: LinearLayout
    private val api = ApiClient.instance.create(RecipesApi::class.java)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_recipes)

        layout = findViewById(R.id.recipesLayout)

        CoroutineScope(Dispatchers.IO).launch {
            try {
                val recipes = api.getAll()

                withContext(Dispatchers.Main) {
                    val inflater = LayoutInflater.from(this@RecipesActivity)
                    recipes.forEach { recipe ->
                        val view = inflater.inflate(R.layout.recipe_card, layout, false)

                        view.findViewById<TextView>(R.id.tvRecipeName).text = recipe.name
                        view.findViewById<TextView>(R.id.tvRecipeDescription).text = recipe.description
                        view.findViewById<TextView>(R.id.tvRecipeDetails).text =
                            "Температура: ${recipe.target_temp}°C | Цукор: ${recipe.target_sugar}% | Алкоголь: ${recipe.target_alcohol}%\nКонтейнер: ${recipe.container_name} — ${recipe.container_location}"

                        layout.addView(view)
                    }
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }
}
