import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchCandidateById,
  updateCandidate,
  deleteCandidate,
} from "@/store/slices/candidatesSlice";
import { fetchEvaluationsByCandidateId } from "@/store/slices/evaluationsSlice";
import { fetchAssessmentsByCandidateId } from "@/store/slices/assessmentsSlice";
import { fetchInterviewSchedulesByCandidateId } from "@/store/slices/interviewSchedulesSlice";
import { toast } from "react-toastify";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Phone,
  Mail,
  BriefcaseBusiness,
  Calendar,
  Edit,
  Trash2,
  ArrowLeft,
  FileText,
  ClipboardList,
  Clock,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AssessmentForm from "@/components/assessments/AssessmentForm";
import EvaluationForm from "@/components/evaluations/EvaluationForm";
import InterviewScheduleForm from "@/components/interviews/InterviewScheduleForm";
import type { InterviewStatus } from "@/types";

export default function CandidateDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { candidate, loading, error } = useAppSelector(
    (state) => state.candidates
  );
  const { candidateEvaluations } = useAppSelector((state) => state.evaluations);
  const { candidateAssessments } = useAppSelector((state) => state.assessments);
  const { candidateInterviewSchedules } = useAppSelector(
    (state) => state.interviewSchedules
  );

  const [interviewStatus, setInterviewStatus] = useState<InterviewStatus | "">(
    ""
  );
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const interviewStatuses: InterviewStatus[] = [
    "Shortlisted",
    "First Interview Complete",
    "Second Interview Complete",
    "Hired",
    "Rejected",
    "Blacklisted",
  ];

  useEffect(() => {
    if (id) {
      dispatch(fetchCandidateById(id));
      dispatch(fetchEvaluationsByCandidateId(id));
      dispatch(fetchAssessmentsByCandidateId(id));
      dispatch(fetchInterviewSchedulesByCandidateId(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (candidate) {
      setInterviewStatus(candidate.interviewStatus);
    }
  }, [candidate]);

  const getStatusIndex = (status: InterviewStatus): number => {
    return interviewStatuses.indexOf(status);
  };

  const handleStatusChange = async (status: string) => {
    if (!candidate) return;
    const currentIndex = getStatusIndex(candidate.interviewStatus);
    const newIndex = getStatusIndex(status as InterviewStatus);

    if (newIndex < currentIndex) {
      toast.warning("You can't move back to a previous step.");
      return;
    }

    if (
      (candidate.interviewStatus === "Hired" &&
        (status === "Rejected" || status === "Blacklisted")) ||
      (candidate.interviewStatus === "Rejected" && status === "Hired")
    ) {
      toast.warning(
        "Invalid transition: Cannot hire a rejected candidate or reject/blacklist a hired one."
      );
      return;
    }

    setIsStatusUpdating(true);
    try {
      await dispatch(
        updateCandidate({
          ...candidate,
          interviewStatus: status as InterviewStatus,
        })
      );
      setInterviewStatus(status as InterviewStatus);
      toast.success("Status updated successfully");
    } catch (error: unknown) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update status");
    } finally {
      setIsStatusUpdating(false);
    }
  };

  const handleDeleteCandidate = async () => {
    if (!candidate) return;

    setIsDeleting(true);
    try {
      await dispatch(deleteCandidate(candidate.id));
      toast.success("Candidate deleted successfully");
      navigate("/candidates");
    } catch (error: unknown) {
      console.error("Failed to delete candidate:", error);
      toast.error("Failed to delete candidate");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Error Loading Candidate
        </h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => navigate("/candidates")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Candidates
        </Button>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <AlertCircle className="h-12 w-12 text-amber-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Candidate Not Found
        </h2>
        <p className="text-gray-600 mb-4">
          The candidate you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate("/candidates")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Candidates
        </Button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Shortlisted":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "First Interview Complete":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Second Interview Complete":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "Hired":
        return "bg-green-100 text-green-800 border-green-200";
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "Blacklisted":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => navigate("/candidates")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="flex space-x-2">
          <Link to={`/candidates/edit/${candidate.id}`}>
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  candidate and all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteCandidate}
                  className="bg-red-500 hover:bg-red-600"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold">
                {candidate.name}
              </CardTitle>
              <CardDescription className="flex items-center mt-1">
                <BriefcaseBusiness className="h-4 w-4 mr-1" />
                {candidate.technology} • {candidate.level} •{" "}
                {candidate.experience}{" "}
                {parseInt(candidate.experience) === 1 ? "year" : "years"} •{" "}
                {candidate.expectedSalary}
              </CardDescription>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <Badge
                variant="outline"
                className={cn(
                  "px-3 py-1 text-sm",
                  getStatusColor(candidate.interviewStatus)
                )}
              >
                {candidate.interviewStatus}
              </Badge>

              <Select
                value={interviewStatus}
                onValueChange={handleStatusChange}
                disabled={isStatusUpdating}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue
                    placeholder={
                      isStatusUpdating ? "Updating..." : "Update status"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {interviewStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-3 text-gray-500" />
                  <span>{candidate.phone}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-3 text-gray-500" />
                  <span>{candidate.email}</span>
                </div>
                {candidate.references && (
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-3 text-gray-500" />
                    <span>References: {candidate.references}</span>
                  </div>
                )}
              </div>
            </div>

            {candidate.notes && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Notes</h3>
                <p className="text-gray-700">{candidate.notes}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="evaluations">
        <TabsList className="grid gap-1 grid-cols-3 mb-6">
          <TabsTrigger value="evaluations">
            <FileText className="h-4 w-4 mr-2" />
            Evaluations
          </TabsTrigger>
          <TabsTrigger value="assessments">
            <ClipboardList className="h-4 w-4 mr-2" />
            Assessments
          </TabsTrigger>
          <TabsTrigger value="interviews">
            <Calendar className="h-4 w-4 mr-2" />
            Interviews
          </TabsTrigger>
        </TabsList>

        <TabsContent value="evaluations" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Candidate Evaluations</h2>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button>Add Evaluation</Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-3xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>Add New Evaluation</AlertDialogTitle>
                </AlertDialogHeader>
                <EvaluationForm candidateId={candidate.id.toString()} />
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {candidateEvaluations.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <FileText className="h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500 text-center">No evaluations yet</p>
                <p className="text-gray-400 text-sm text-center mt-1">
                  Add behavioral and technical remarks for this candidate
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {candidateEvaluations.map((evaluation) => (
                <Card key={evaluation.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                      Evaluation from{" "}
                      {format(new Date(evaluation.date), "MMM d, yyyy")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">
                          Behavioral Assessment
                        </h4>
                        <p className="text-gray-700">
                          {evaluation.behavioralRemarks}
                        </p>
                      </div>
                      <Separator />
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">
                          Technical Assessment
                        </h4>
                        <p className="text-gray-700">
                          {evaluation.technicalRemarks}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="assessments" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Assigned Assessments</h2>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button>Assign Assessment</Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-lg">
                <AlertDialogHeader>
                  <AlertDialogTitle>Assign New Assessment</AlertDialogTitle>
                </AlertDialogHeader>
                <AssessmentForm candidateId={candidate.id.toString()} />
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {candidateAssessments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <ClipboardList className="h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500 text-center">
                  No assessments assigned
                </p>
                <p className="text-gray-400 text-sm text-center mt-1">
                  Assign technical assessments to evaluate this candidate
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {candidateAssessments.map((assessment) => (
                <Card key={assessment.id}>
                  <CardHeader>
                    <CardTitle>{assessment.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{assessment.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="interviews" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Interview Schedule</h2>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button>Schedule Interview</Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-lg">
                <AlertDialogHeader>
                  <AlertDialogTitle>Schedule New Interview</AlertDialogTitle>
                </AlertDialogHeader>
                <InterviewScheduleForm
                  candidateId={candidate.id.toString()}
                  candidateName={candidate.name}
                  candidateEmail={candidate.email}
                />
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {candidateInterviewSchedules.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Calendar className="h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500 text-center">
                  No interviews scheduled
                </p>
                <p className="text-gray-400 text-sm text-center mt-1">
                  Schedule an interview with this candidate
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {[...candidateInterviewSchedules] // Create a copy to avoid mutations
                .sort(
                  (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
                )
                .map((schedule) => {
                  const interviewDate = new Date(schedule.date);
                  const isPast = interviewDate < new Date();

                  return (
                    <Card
                      key={schedule.id}
                      className={cn(isPast ? "bg-gray-50" : "bg-white")}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex justify-between">
                          <div className="flex items-center">
                            <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                            {format(interviewDate, "EEEE, MMMM d, yyyy")}
                          </div>
                          {isPast ? (
                            <Badge
                              variant="outline"
                              className="bg-gray-100 text-gray-800"
                            >
                              Past
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-green-100 text-green-800"
                            >
                              Upcoming
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {format(interviewDate, "h:mm a")}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">
                              Interviewers
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {schedule.interviewers.map(
                                (interviewer, index) => (
                                  <Badge key={index} variant="secondary">
                                    {interviewer}
                                  </Badge>
                                )
                              )}
                            </div>
                          </div>
                          {schedule.notes && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">
                                Notes
                              </h4>
                              <p className="text-gray-700">{schedule.notes}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end gap-2">
                        {!isPast && (
                          <Button variant="outline" size="sm">
                            Reschedule
                          </Button>
                        )}
                        <Button
                          variant="secondary"
                          className="bg-red-500/40 hover:bg-red-600/60"
                          size="sm"
                        >
                          {isPast ? "View Details" : "Send Reminder"}
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
