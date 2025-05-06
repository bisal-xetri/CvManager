import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Assessment } from "@/types";

// API URL
const API_URL = "https://jsonserver-1-etxz.onrender.com/assessments";

// Initial state
interface AssessmentsState {
  assessments: Assessment[];
  candidateAssessments: Assessment[];
  loading: boolean;
  error: string | null;
}

const initialState: AssessmentsState = {
  assessments: [],
  candidateAssessments: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchAssessments = createAsyncThunk(
  "assessments/fetchAssessments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch assessments");
      }
      const data = await response.json();
      return data as Assessment[];
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchAssessmentsByCandidateId = createAsyncThunk(
  "assessments/fetchAssessmentsByCandidateId",
  async (candidateId: number | string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}?candidateId=${candidateId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch candidate assessments");
      }
      const data = await response.json();
      return data as Assessment[];
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createAssessment = createAsyncThunk(
  "assessments/createAssessment",
  async (assessment: Omit<Assessment, "id">, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(assessment),
      });
      if (!response.ok) {
        throw new Error("Failed to create assessment");
      }
      const data = await response.json();
      return data as Assessment;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateAssessment = createAsyncThunk(
  "assessments/updateAssessment",
  async (assessment: Assessment, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${assessment.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(assessment),
      });
      if (!response.ok) {
        throw new Error("Failed to update assessment");
      }
      const data = await response.json();
      return data as Assessment;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteAssessment = createAsyncThunk(
  "assessments/deleteAssessment",
  async (id: number | string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete assessment");
      }
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Slice
const assessmentsSlice = createSlice({
  name: "assessments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all assessments
      .addCase(fetchAssessments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssessments.fulfilled, (state, action) => {
        state.assessments = action.payload;
        state.loading = false;
      })
      .addCase(fetchAssessments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch assessments by candidate ID
      .addCase(fetchAssessmentsByCandidateId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssessmentsByCandidateId.fulfilled, (state, action) => {
        state.candidateAssessments = action.payload;
        state.loading = false;
      })
      .addCase(fetchAssessmentsByCandidateId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create assessment
      .addCase(createAssessment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAssessment.fulfilled, (state, action) => {
        state.assessments.push(action.payload);
        if (
          state.candidateAssessments.length > 0 &&
          state.candidateAssessments[0].candidateId ===
            action.payload.candidateId
        ) {
          state.candidateAssessments.push(action.payload);
        }
        state.loading = false;
      })
      .addCase(createAssessment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update assessment
      .addCase(updateAssessment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAssessment.fulfilled, (state, action) => {
        const index = state.assessments.findIndex(
          (assessment) => assessment.id === action.payload.id
        );
        if (index !== -1) {
          state.assessments[index] = action.payload;
        }

        const candidateIndex = state.candidateAssessments.findIndex(
          (assessment) => assessment.id === action.payload.id
        );
        if (candidateIndex !== -1) {
          state.candidateAssessments[candidateIndex] = action.payload;
        }

        state.loading = false;
      })
      .addCase(updateAssessment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete assessment
      .addCase(deleteAssessment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAssessment.fulfilled, (state, action) => {
        state.assessments = state.assessments.filter(
          (assessment) => assessment.id !== action.payload
        );
        state.candidateAssessments = state.candidateAssessments.filter(
          (assessment) => assessment.id !== action.payload
        );
        state.loading = false;
      })
      .addCase(deleteAssessment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default assessmentsSlice.reducer;
