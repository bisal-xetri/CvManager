import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch } from '@/store';
import { createAssessment } from '@/store/slices/assessmentsSlice';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Assessment } from '@/types';

interface AssessmentFormProps {
  candidateId: string;
}

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
});

export default function AssessmentForm({ candidateId }: AssessmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useAppDispatch();

  const initialValues = {
    title: '',
    description: '',
    candidateId,
  };

  const handleSubmit = async (values: Omit<Assessment, 'id'>) => {
    setIsSubmitting(true);
    try {
      await dispatch(createAssessment(values));
      toast.success('Assessment created successfully');
    } catch (error) {
      toast.error('Failed to create assessment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Field
            as={Input}
            id="title"
            name="title"
            placeholder="e.g., Frontend React Challenge"
          />
          <ErrorMessage name="title" component="div" className="text-sm text-red-500" />
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
          <ErrorMessage name="description" component="div" className="text-sm text-red-500" />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              'Create Assessment'
            )}
          </Button>
        </div>
      </Form>
    </Formik>
  );
}