import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { signInWithPopup, signOut as firebaseSignOut } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

export const signInWithGoogle = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>("auth/signInWithGoogle", async (_, { rejectWithValue }) => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    return {
      uid: user.uid,
      email: user.email || "",
      displayName: user.displayName || "",
      photoURL: user.photoURL || undefined,
    };
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const signOut = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/signOut",
  async (_, { rejectWithValue }) => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(signInWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Google sign-in failed";
      })
      .addCase(signOut.pending, (state) => {
        state.loading = true;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
      })
      .addCase(signOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Sign out failed";
      });
  },
});

export const { setUser, setLoading, clearError } = authSlice.actions;
export default authSlice.reducer;
