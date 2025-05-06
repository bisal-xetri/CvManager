import { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  createAssessment,
  updateAssessment,
} from "@/store/slices/assessmentsSlice";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { fetchCandidates } from "@/store/slices/candidatesSlice";
import type { Assessment } from "@/types";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ErrorMessage } from "formik";

interface AssessmentFormProps {
  initialData?: Assessment | null; // For edit mode
  candidateId?: string;
  onSuccess?: () => void;
  onCancel?: () => void; // For cancel button in edit mode
}

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  assignedTo: Yup.string().required("Please select a candidate"),
});

export default function AssessmentForm({
  initialData,
  candidateId,
  onSuccess,
  onCancel,
}: AssessmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const { candidates, loading, error } = useAppSelector(
    (state) => state.candidates
  );

  useEffect(() => {
    dispatch(fetchCandidates());
  }, [dispatch]);

  const initialValues = initialData
    ? {
        title: initialData.title,
        description: initialData.description,
        assignedTo: String(initialData.candidateId),
      }
    : {
        title: "",
        description: "",
        assignedTo: candidateId ? String(candidateId) : "",
      };

  const handleSubmit = async (values: {
    title: string;
    description: string;
    assignedTo: string;
  }) => {
    setIsSubmitting(true);
    try {
      if (initialData) {
        // Edit mode
        await dispatch(
          updateAssessment({
            id: initialData.id,
            ...values,
            candidateId: values.assignedTo,
          })
        ).unwrap();
        toast.success("Assessment updated successfully");
      } else {
        // Create mode
        await dispatch(
          createAssessment({
            title: values.title,
            description: values.description,
            candidateId: values.assignedTo,
          })
        ).unwrap();
        toast.success("Assessment created successfully");
      }

      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(
        initialData
          ? "Failed to update assessment"
          : "Failed to create assessment"
      );
      console.error("Assessment error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableCandidates = candidates.filter(
    (candidate) => candidate.interviewStatus !== "Hired"
  );

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize // Important for edit mode
    >
      {({ setFieldValue, values }) => (
        <Form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Field
              as={Input}
              id="title"
              name="title"
              placeholder="e.g., Frontend React Challenge"
            />
            <ErrorMessage
              name="title"
              component="div"
              className="text-sm text-red-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Field
              as={Textarea}
              id="description"
              name="description"
              placeholder="Describe the assessment task in detail"
              className="min-h-[100px]"
            />
            <ErrorMessage
              name="description"
              component="div"
              className="text-sm text-red-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignedTo">Assign to</Label>
            <Select
              value={values.assignedTo}
              onValueChange={(value) => setFieldValue("assignedTo", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a candidate" />
              </SelectTrigger>
              <SelectContent>
                {loading ? (
                  <SelectItem value="loading" disabled>
                    Loading candidates...
                  </SelectItem>
                ) : error ? (
                  <SelectItem value="error" disabled>
                    Error loading candidates
                  </SelectItem>
                ) : availableCandidates.length > 0 ? (
                  availableCandidates.map((candidate) => (
                    <SelectItem key={candidate.id} value={String(candidate.id)}>
                      {candidate.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="noCandidates" disabled>
                    No available candidates
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            <ErrorMessage
              name="assignedTo"
              component="div"
              className="text-sm text-red-500"
            />
          </div>

          <div className="flex justify-end gap-2">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  {initialData ? "Updating..." : "Creating..."}
                </>
              ) : initialData ? (
                "Update Assessment"
              ) : (
                "Create Assessment"
              )}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
