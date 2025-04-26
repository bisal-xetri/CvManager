import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchAssessments,
  deleteAssessment,
} from "@/store/slices/assessmentsSlice";
import { fetchCandidates } from "@/store/slices/candidatesSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Link } from "react-router-dom";
import { Search, Plus, ClipboardCheck, Loader2, Trash2 } from "lucide-react";
import { AssessmentForm } from "@/components";

export default function AssessmentsPage() {
  const dispatch = useAppDispatch();
  const { assessments, loading } = useAppSelector((state) => state.assessments);
  const { candidates } = useAppSelector((state) => state.candidates);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAssessment, setSelectedAssessment] = useState<number | null>(
    null
  );

  useEffect(() => {
    dispatch(fetchAssessments());
    dispatch(fetchCandidates());
  }, [dispatch]);

  const getCandidateName = (candidateId: string | number) => {
    const candidate = candidates.find((c) => c.id === candidateId);
    return candidate ? candidate.name : "Unknown Candidate";
  };

  const handleConfirmDelete = async () => {
    if (selectedAssessment) {
      try {
        await dispatch(deleteAssessment(selectedAssessment)).unwrap(); // ensure success
        dispatch(fetchAssessments()); // ✅ Refetch updated list
        setSelectedAssessment(null); // Reset selected item
      } catch (error) {
        console.error("Failed to delete assessment:", error);
      }
    }
  };

  const filteredAssessments = assessments.filter((assessment) => {
    const candidateName = getCandidateName(
      assessment.candidateId
    ).toLowerCase();
    return (
      assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidateName.includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Assessments</h1>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Assessment
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-lg">
            <AlertDialogHeader>
              <AlertDialogTitle>Create New Assessment</AlertDialogTitle>
              <AlertDialogDescription>
                Create an assessment and assign it to a candidate
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-4 py-4">
              <AssessmentForm
                candidateId={
                  candidates.length > 0 ? candidates[0].id.toString() : "1"
                }
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search assessments"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Assessments Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredAssessments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssessments.map((assessment) => (
            <Card key={assessment.id}>
              <CardHeader>
                <CardTitle>{assessment.title}</CardTitle>
                <CardDescription>
                  Assigned to: {getCandidateName(assessment.candidateId)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{assessment.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between space-x-2">
                <Link to={`/candidates/${assessment.candidateId}`}>
                  <Button variant="outline" size="sm">
                    View Candidate
                  </Button>
                </Link>

                <Button variant="outline" size="sm">
                  Edit
                </Button>

                {/* Delete Button with Modal Confirmation */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        setSelectedAssessment(Number(assessment.id))
                      }
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-sm">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this assessment? This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        onClick={() => setSelectedAssessment(null)}
                      >
                        Cancel
                      </AlertDialogCancel>
                      <Button
                        variant="destructive"
                        onClick={handleConfirmDelete}
                      >
                        Confirm
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <ClipboardCheck className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No assessments found</p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="mt-4">Create Your First Assessment</Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-lg">
              <AlertDialogHeader>
                <AlertDialogTitle>Create New Assessment</AlertDialogTitle>
                <AlertDialogDescription>
                  Create an assessment and assign it to a candidate
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="space-y-4 py-4">
                <AssessmentForm
                  candidateId={
                    candidates.length > 0 ? candidates[0].id.toString() : "1"
                  }
                />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
}
