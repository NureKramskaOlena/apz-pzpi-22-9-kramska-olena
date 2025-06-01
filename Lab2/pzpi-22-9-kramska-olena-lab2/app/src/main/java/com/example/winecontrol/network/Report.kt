package com.example.winecontrol.network

data class Report(
    val report_id: Int,
    val name: String,
    val content: String,
    val recipe_name: String?,
    val container_name: String,
    val container_location: String,
    val capacity: Float,
    val created_at: String,
    val generated_by: String
)
data class ReportRequest(
    val name: String,
    val content: String,
    val recipe_id: Int,
    val container_id: Int,
    val generated_by: Int
)
