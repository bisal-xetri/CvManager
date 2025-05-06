// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { setUser, setLoading } from "./slices/authSlice";

// Import your reducers
import candidatesReducer from "./slices/candidatesSlice";
import assessmentsReducer from "./slices/assessmentsSlice";
import evaluationsReducer from "./slices/evaluationsSlice";
import offerTemplatesReducer from "./slices/offerTemplatesSlice";
import interviewSchedulesReducer from "./slices/interviewSchedulesSlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    candidates: candidatesReducer,
    assessments: assessmentsReducer,
    evaluations: evaluationsReducer,
    offerTemplates: offerTemplatesReducer,
    interviewSchedules: interviewSchedulesReducer,
    auth: authReducer,
  },
});

// Initialize auth state
store.dispatch(setLoading(true));
onAuthStateChanged(auth, (user) => {
  if (user) {
    store.dispatch(
      setUser({
        uid: user.uid,
        email: user.email || "",
        displayName: user.displayName || "",
        photoURL: user.photoURL || undefined,
      })
    );
  } else {
    store.dispatch(setUser(null));
  }
  store.dispatch(setLoading(false));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
