import {createAsyncThunk} from "@reduxjs/toolkit";
import { ExamCard } from "../../models/ExamCard";


export const fetchExams = createAsyncThunk("exams/fetchExams", async () => {
    const response = await fetch("http://localhost:5000/exams");
    const data = await response.json();
    return data;
});

export const addExam = createAsyncThunk("exams/addExam", async (exam: ExamCard) => {
    const response = await fetch("http://localhost:5000/exams", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
      body: JSON.stringify(exam)
    });
    const data = await response.json();
    console.log("Newly created exam:", data);
    return data;
});

export const updateExam = createAsyncThunk("exams/updateExam", async (exam: ExamCard) => {
    const response = await fetch(`http://localhost:5000/exams/${exam.id}`, {
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
    await fetch(`http://localhost:5000/exams/${id}`, {
      method: "DELETE"
    });
    return id;
});

