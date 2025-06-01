package com.example.winecontrol.network

import retrofit2.http.GET

interface RecipesApi {
    @GET("recipes")
    suspend fun getAll(): List<Recipe>
}
