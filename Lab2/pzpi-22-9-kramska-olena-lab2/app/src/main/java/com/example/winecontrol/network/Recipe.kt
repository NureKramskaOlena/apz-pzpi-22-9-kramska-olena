package com.example.winecontrol.network

data class Recipe(
    val recipe_id: Int,
    val name: String,
    val description: String,
    val target_temp: Float,
    val target_sugar: Float,
    val target_alcohol: Float,
    val container_name: String?,
    val container_location: String?
)
