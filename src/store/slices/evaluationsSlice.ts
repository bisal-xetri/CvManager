import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Evaluation } from '@/types';

// API URL
const API_URL = 'http://localhost:3001/evaluations';

// Initial state
interface EvaluationsState {
  evaluations: Evaluation[];
  candidateEvaluations: Evaluation[];
  loading: boolean;
  error: string | null;
}

const initialState: EvaluationsState = {
  evaluations: [],
  candidateEvaluations: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchEvaluations = createAsyncThunk(
  'evaluations/fetchEvaluations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch evaluations');
      }
      const data = await response.json();
      return data as Evaluation[];
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchEvaluationsByCandidateId = createAsyncThunk(
  'evaluations/fetchEvaluationsByCandidateId',
  async (candidateId: number | string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}?candidateId=${candidateId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch candidate evaluations');
      }
      const data = await response.json();
      return data as Evaluation[];
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createEvaluation = createAsyncThunk(
  'evaluations/createEvaluation',
  async (evaluation: Omit<Evaluation, 'id'>, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(evaluation),
      });
      if (!response.ok) {
        throw new Error('Failed to create evaluation');
      }
      const data = await response.json();
      return data as Evaluation;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateEvaluation = createAsyncThunk(
  'evaluations/updateEvaluation',
  async (evaluation: Evaluation, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${evaluation.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(evaluation),
      });
      if (!response.ok) {
        throw new Error('Failed to update evaluation');
      }
      const data = await response.json();
      return data as Evaluation;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteEvaluation = createAsyncThunk(
  'evaluations/deleteEvaluation',
  async (id: number | string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete evaluation');
      }
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Slice
const evaluationsSlice = createSlice({
  name: 'evaluations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all evaluations
      .addCase(fetchEvaluations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvaluations.fulfilled, (state, action) => {
        state.evaluations = action.payload;
        state.loading = false;
      })
      .addCase(fetchEvaluations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch evaluations by candidate ID
      .addCase(fetchEvaluationsByCandidateId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvaluationsByCandidateId.fulfilled, (state, action) => {
        state.candidateEvaluations = action.payload;
        state.loading = false;
      })
      .addCase(fetchEvaluationsByCandidateId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create evaluation
      .addCase(createEvaluation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvaluation.fulfilled, (state, action) => {
        state.evaluations.push(action.payload);
        if (state.candidateEvaluations.length > 0 && 
            state.candidateEvaluations[0].candidateId === action.payload.candidateId) {
          state.candidateEvaluations.push(action.payload);
        }
        state.loading = false;
      })
      .addCase(createEvaluation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update evaluation
      .addCase(updateEvaluation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEvaluation.fulfilled, (state, action) => {
        const index = state.evaluations.findIndex(
          (evaluation) => evaluation.id === action.payload.id
        );
        if (index !== -1) {
          state.evaluations[index] = action.payload;
        }
        
        const candidateIndex = state.candidateEvaluations.findIndex(
          (evaluation) => evaluation.id === action.payload.id
        );
        if (candidateIndex !== -1) {
          state.candidateEvaluations[candidateIndex] = action.payload;
        }
        
        state.loading = false;
      })
      .addCase(updateEvaluation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete evaluation
      .addCase(deleteEvaluation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEvaluation.fulfilled, (state, action) => {
        state.evaluations = state.evaluations.filter(
          (evaluation) => evaluation.id !== action.payload
        );
        state.candidateEvaluations = state.candidateEvaluations.filter(
          (evaluation) => evaluation.id !== action.payload
        );
        state.loading = false;
      })
      .addCase(deleteEvaluation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default evaluationsSlice.reducer;