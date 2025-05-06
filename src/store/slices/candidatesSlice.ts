import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Candidate } from "@/types";

// API URL
const API_URL = "https://jsonserver-1-etxz.onrender.com/candidates";

// Initial state
interface CandidatesState {
  candidates: Candidate[];
  candidate: Candidate | null;
  loading: boolean;
  error: string | null;
}

const initialState: CandidatesState = {
  candidates: [],
  candidate: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchCandidates = createAsyncThunk(
  "candidates/fetchCandidates",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch candidates");
      }
      const data = await response.json();
      return data as Candidate[];
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchCandidateById = createAsyncThunk(
  "candidates/fetchCandidateById",
  async (id: number | string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch candidate");
      }
      const data = await response.json();
      return data as Candidate;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createCandidate = createAsyncThunk(
  "candidates/createCandidate",
  async (candidate: Omit<Candidate, "id">, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(candidate),
      });
      if (!response.ok) {
        throw new Error("Failed to create candidate");
      }
      const data = await response.json();
      return data as Candidate;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateCandidate = createAsyncThunk(
  "candidates/updateCandidate",
  async (candidate: Candidate, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${candidate.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(candidate),
      });
      if (!response.ok) {
        throw new Error("Failed to update candidate");
      }
      const data = await response.json();
      return data as Candidate;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteCandidate = createAsyncThunk(
  "candidates/deleteCandidate",
  async (id: number | string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete candidate");
      }
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Slice
const candidatesSlice = createSlice({
  name: "candidates",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all candidates
      .addCase(fetchCandidates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCandidates.fulfilled, (state, action) => {
        state.candidates = action.payload;
        state.loading = false;
      })
      .addCase(fetchCandidates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch candidate by ID
      .addCase(fetchCandidateById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCandidateById.fulfilled, (state, action) => {
        state.candidate = action.payload;
        state.loading = false;
      })
      .addCase(fetchCandidateById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create candidate
      .addCase(createCandidate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCandidate.fulfilled, (state, action) => {
        state.candidates.push(action.payload);
        state.loading = false;
      })
      .addCase(createCandidate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update candidate
      .addCase(updateCandidate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCandidate.fulfilled, (state, action) => {
        const index = state.candidates.findIndex(
          (candidate) => candidate.id === action.payload.id
        );
        if (index !== -1) {
          state.candidates[index] = action.payload;
        }
        if (state.candidate && state.candidate.id === action.payload.id) {
          state.candidate = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateCandidate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete candidate
      .addCase(deleteCandidate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCandidate.fulfilled, (state, action) => {
        state.candidates = state.candidates.filter(
          (candidate) => candidate.id !== action.payload
        );
        if (state.candidate && state.candidate.id === action.payload) {
          state.candidate = null;
        }
        state.loading = false;
      })
      .addCase(deleteCandidate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default candidatesSlice.reducer;
