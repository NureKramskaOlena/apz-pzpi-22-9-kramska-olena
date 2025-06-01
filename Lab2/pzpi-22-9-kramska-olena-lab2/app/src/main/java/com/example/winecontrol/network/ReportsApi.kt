package com.example.winecontrol.network

import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path

interface ReportsApi {

    @GET("reports")
    suspend fun getAllReports(): List<Report>

    @POST("reports")
    suspend fun addReport(@Body report: ReportRequest)

    @DELETE("reports/{id}")
    suspend fun deleteReport(@Path("id") id: Int)

}
