import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { OfferTemplate } from '@/types';

// API URL
const API_URL = 'http://localhost:3001/offerTemplates';

// Initial state
interface OfferTemplatesState {
  offerTemplates: OfferTemplate[];
  loading: boolean;
  error: string | null;
}

const initialState: OfferTemplatesState = {
  offerTemplates: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchOfferTemplates = createAsyncThunk(
  'offerTemplates/fetchOfferTemplates',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch offer templates');
      }
      const data = await response.json();
      return data as OfferTemplate[];
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createOfferTemplate = createAsyncThunk(
  'offerTemplates/createOfferTemplate',
  async (offerTemplate: Omit<OfferTemplate, 'id'>, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(offerTemplate),
      });
      if (!response.ok) {
        throw new Error('Failed to create offer template');
      }
      const data = await response.json();
      return data as OfferTemplate;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateOfferTemplate = createAsyncThunk(
  'offerTemplates/updateOfferTemplate',
  async (offerTemplate: OfferTemplate, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${offerTemplate.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(offerTemplate),
      });
      if (!response.ok) {
        throw new Error('Failed to update offer template');
      }
      const data = await response.json();
      return data as OfferTemplate;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteOfferTemplate = createAsyncThunk(
  'offerTemplates/deleteOfferTemplate',
  async (id: number | string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete offer template');
      }
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Slice
const offerTemplatesSlice = createSlice({
  name: 'offerTemplates',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all offer templates
      .addCase(fetchOfferTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOfferTemplates.fulfilled, (state, action) => {
        state.offerTemplates = action.payload;
        state.loading = false;
      })
      .addCase(fetchOfferTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create offer template
      .addCase(createOfferTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOfferTemplate.fulfilled, (state, action) => {
        state.offerTemplates.push(action.payload);
        state.loading = false;
      })
      .addCase(createOfferTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update offer template
      .addCase(updateOfferTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOfferTemplate.fulfilled, (state, action) => {
        const index = state.offerTemplates.findIndex(
          (offerTemplate) => offerTemplate.id === action.payload.id
        );
        if (index !== -1) {
          state.offerTemplates[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateOfferTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete offer template
      .addCase(deleteOfferTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOfferTemplate.fulfilled, (state, action) => {
        state.offerTemplates = state.offerTemplates.filter(
          (offerTemplate) => offerTemplate.id !== action.payload
        );
        state.loading = false;
      })
      .addCase(deleteOfferTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default offerTemplatesSlice.reducer;