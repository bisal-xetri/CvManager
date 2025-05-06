import { createBrowserRouter } from "react-router-dom";
import AuthenticatedLayout from "@/components/layout/AuthenticatedLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AuthRedirect } from "@/components/auth/AuthRedirect";
import { AuthLoader } from "@/components/auth/AuthLoader";
// Pages
import HomePage from "@/pages/HomePage";

import DashboardPage from "@/pages/DashboardPage";
import CandidatesPage from "@/pages/CandidatesPage";
import CandidateNewPage from "@/pages/CandidateNewPage";
import CandidateEditPage from "@/pages/CandidateEditPage";
import CandidateDetailPage from "@/pages/CandidateDetailPage";
import AssessmentsPage from "@/pages/AssessmentsPage";
import InterviewsPage from "@/pages/InterviewsPage";
import OffersPage from "@/pages/OffersPage";
import NotFound from "@/pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthLoader>
        <AuthRedirect>
          <HomePage />
        </AuthRedirect>
      </AuthLoader>
    ),
  },
  {
    path: "/login",
    element: (
      <AuthLoader>
        <AuthRedirect>
          <HomePage />
        </AuthRedirect>
      </AuthLoader>
    ),
  },
  {
    element: (
      <AuthLoader>
        <ProtectedRoute>
          <AuthenticatedLayout />
        </ProtectedRoute>
      </AuthLoader>
    ),
    children: [
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/candidates",
        element: <CandidatesPage />,
      },
      {
        path: "/candidates/new",
        element: <CandidateNewPage />,
      },
      {
        path: "/candidates/edit/:id",
        element: <CandidateEditPage />,
      },
      {
        path: "/candidates/:id",
        element: <CandidateDetailPage />,
      },
      {
        path: "/assessments",
        element: <AssessmentsPage />,
      },
      {
        path: "/interviews",
        element: <InterviewsPage />,
      },
      {
        path: "/offers",
        element: <OffersPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
