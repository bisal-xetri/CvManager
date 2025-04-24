import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthenticatedLayout from '@/components/layout/AuthenticatedLayout';

// Pages
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import CandidatesPage from '@/pages/CandidatesPage';
import CandidateNewPage from '@/pages/CandidateNewPage';
import CandidateEditPage from '@/pages/CandidateEditPage';
import CandidateDetailPage from '@/pages/CandidateDetailPage';
import AssessmentsPage from '@/pages/AssessmentsPage';
import InterviewsPage from '@/pages/InterviewsPage';
import OffersPage from '@/pages/OffersPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <AuthenticatedLayout />,
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/candidates',
        element: <CandidatesPage />,
      },
      {
        path: '/candidates/new',
        element: <CandidateNewPage />,
      },
      {
        path: '/candidates/edit/:id',
        element: <CandidateEditPage />,
      },
      {
        path: '/candidates/:id',
        element: <CandidateDetailPage />,
      },
      {
        path: '/assessments',
        element: <AssessmentsPage />,
      },
      {
        path: '/interviews',
        element: <InterviewsPage />,
      },
      {
        path: '/offers',
        element: <OffersPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export default router;