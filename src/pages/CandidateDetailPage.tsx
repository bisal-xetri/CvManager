import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "@/store";
import { fetchCandidateById } from "@/store/slices/candidatesSlice";
import { fetchEvaluationsByCandidateId } from "@/store/slices/evaluationsSlice";
import { fetchAssessmentsByCandidateId } from "@/store/slices/assessmentsSlice";
import { fetchInterviewSchedulesByCandidateId } from "@/store/slices/interviewSchedulesSlice";
import { CandidateDetails } from "@/components";

export default function CandidateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (id) {
      dispatch(fetchCandidateById(id));
      dispatch(fetchEvaluationsByCandidateId(id));
      dispatch(fetchAssessmentsByCandidateId(id));
      dispatch(fetchInterviewSchedulesByCandidateId(id));
    }
  }, [dispatch, id]);

  return <CandidateDetails />;
}
