import {createAsyncThunk} from "@reduxjs/toolkit";
import { AddExam } from "./types";
import { ExamCard } from "@/api/endpoints/exams/types";

const baseUrl = "http://localhost:5099/exams";

export const fetchExams = createAsyncThunk("exams/fetchExams", async () => {
    const response = await fetch(baseUrl);
    const data = await response.json();
    return data;
});

export const addExam = createAsyncThunk("exams/addExam", async (exam: ExamCard) => {
    const addExam: AddExam = { title: exam.title, semester: exam.semester, schedule: exam.schedule };

    const response = await fetch(baseUrl, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
      body: JSON.stringify(addExam)
    });
    const data = await response.json()
    return data;
});

export const updateExam = createAsyncThunk("exams/updateExam", async (exam: ExamCard) => {
    const response = await fetch(`${baseUrl}/${exam.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(exam)
    });
    if (!response.ok) {
      throw new Error(`Failed to update exam with id: ${exam.id}`);
    }
    const data = await response.json();
    return data;
});
  
export const removeExam = createAsyncThunk("exams/removeExam", async (id: string) => {
    await fetch(`${baseUrl}/${id}`, {
      method: "DELETE"
    });
    return id;
});