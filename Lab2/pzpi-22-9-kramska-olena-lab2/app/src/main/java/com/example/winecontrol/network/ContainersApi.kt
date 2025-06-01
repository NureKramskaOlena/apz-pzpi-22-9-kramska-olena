package com.example.winecontrol.network

import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path

interface ContainersApi {
    @GET("/api/containers")
    suspend fun getAllContainers(): List<Container>
    @POST("/api/containers")
    suspend fun addContainer(@Body container: Container)
    @PUT("containers/{id}")
    suspend fun updateContainer(@Path("id") id: Int, @Body container: Container)
    @DELETE("containers/{id}")
    suspend fun deleteContainer(@Path("id") id: Int)

}
