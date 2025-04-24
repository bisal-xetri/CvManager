import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';

import candidatesReducer from './slices/candidatesSlice';
import assessmentsReducer from './slices/assessmentsSlice';
import evaluationsReducer from './slices/evaluationsSlice';
import offerTemplatesReducer from './slices/offerTemplatesSlice';
import interviewSchedulesReducer from './slices/interviewSchedulesSlice';
import authReducer from './slices/authSlice';

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

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;