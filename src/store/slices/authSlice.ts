import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  signInWithPopup, 
  signOut as firebaseSignOut,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import type { AuthState, User } from '@/types';

// Initial state
const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

// Async thunks
export const signInWithGoogle = createAsyncThunk(
  'auth/signInWithGoogle',
  async (_, { rejectWithValue }) => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      
      if (!credential) {
        throw new Error('No credential returned from Firebase');
      }
      
      const user = result.user;
      return {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        photoURL: user.photoURL || undefined,
      } as User;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const signOut = createAsyncThunk(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    try {
      await firebaseSignOut(auth);
      return null;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Sign in with Google
      .addCase(signInWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(signInWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Sign out
      .addCase(signOut.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
        state.error = null;
      })
      .addCase(signOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUser, clearError } = authSlice.actions;

export default authSlice.reducer;