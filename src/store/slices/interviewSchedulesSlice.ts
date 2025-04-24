import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { InterviewSchedule } from '@/types';

// API URL
const API_URL = 'http://localhost:3001/interviewSchedules';

// Initial state
interface InterviewSchedulesState {
  interviewSchedules: InterviewSchedule[];
  candidateInterviewSchedules: InterviewSchedule[];
  loading: boolean;
  error: string | null;
}

const initialState: InterviewSchedulesState = {
  interviewSchedules: [],
  candidateInterviewSchedules: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchInterviewSchedules = createAsyncThunk(
  'interviewSchedules/fetchInterviewSchedules',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch interview schedules');
      }
      const data = await response.json();
      return data as InterviewSchedule[];
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchInterviewSchedulesByCandidateId = createAsyncThunk(
  'interviewSchedules/fetchInterviewSchedulesByCandidateId',
  async (candidateId: number | string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}?candidateId=${candidateId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch candidate interview schedules');
      }
      const data = await response.json();
      return data as InterviewSchedule[];
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createInterviewSchedule = createAsyncThunk(
  'interviewSchedules/createInterviewSchedule',
  async (interviewSchedule: Omit<InterviewSchedule, 'id'>, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(interviewSchedule),
      });
      if (!response.ok) {
        throw new Error('Failed to create interview schedule');
      }
      const data = await response.json();
      return data as InterviewSchedule;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateInterviewSchedule = createAsyncThunk(
  'interviewSchedules/updateInterviewSchedule',
  async (interviewSchedule: InterviewSchedule, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${interviewSchedule.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(interviewSchedule),
      });
      if (!response.ok) {
        throw new Error('Failed to update interview schedule');
      }
      const data = await response.json();
      return data as InterviewSchedule;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteInterviewSchedule = createAsyncThunk(
  'interviewSchedules/deleteInterviewSchedule',
  async (id: number | string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete interview schedule');
      }
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Slice
const interviewSchedulesSlice = createSlice({
  name: 'interviewSchedules',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all interview schedules
      .addCase(fetchInterviewSchedules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInterviewSchedules.fulfilled, (state, action) => {
        state.interviewSchedules = action.payload;
        state.loading = false;
      })
      .addCase(fetchInterviewSchedules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch interview schedules by candidate ID
      .addCase(fetchInterviewSchedulesByCandidateId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInterviewSchedulesByCandidateId.fulfilled, (state, action) => {
        state.candidateInterviewSchedules = action.payload;
        state.loading = false;
      })
      .addCase(fetchInterviewSchedulesByCandidateId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create interview schedule
      .addCase(createInterviewSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInterviewSchedule.fulfilled, (state, action) => {
        state.interviewSchedules.push(action.payload);
        if (state.candidateInterviewSchedules.length > 0 && 
            state.candidateInterviewSchedules[0].candidateId === action.payload.candidateId) {
          state.candidateInterviewSchedules.push(action.payload);
        }
        state.loading = false;
      })
      .addCase(createInterviewSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update interview schedule
      .addCase(updateInterviewSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInterviewSchedule.fulfilled, (state, action) => {
        const index = state.interviewSchedules.findIndex(
          (interviewSchedule) => interviewSchedule.id === action.payload.id
        );
        if (index !== -1) {
          state.interviewSchedules[index] = action.payload;
        }
        
        const candidateIndex = state.candidateInterviewSchedules.findIndex(
          (interviewSchedule) => interviewSchedule.id === action.payload.id
        );
        if (candidateIndex !== -1) {
          state.candidateInterviewSchedules[candidateIndex] = action.payload;
        }
        
        state.loading = false;
      })
      .addCase(updateInterviewSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete interview schedule
      .addCase(deleteInterviewSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInterviewSchedule.fulfilled, (state, action) => {
        state.interviewSchedules = state.interviewSchedules.filter(
          (interviewSchedule) => interviewSchedule.id !== action.payload
        );
        state.candidateInterviewSchedules = state.candidateInterviewSchedules.filter(
          (interviewSchedule) => interviewSchedule.id !== action.payload
        );
        state.loading = false;
      })
      .addCase(deleteInterviewSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default interviewSchedulesSlice.reducer;