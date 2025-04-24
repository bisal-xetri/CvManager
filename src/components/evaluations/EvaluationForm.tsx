import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch } from '@/store';
import { createEvaluation } from '@/store/slices/evaluationsSlice';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Evaluation } from '@/types';

interface EvaluationFormProps {
  candidateId: string;
}

const validationSchema = Yup.object({
  behavioralRemarks: Yup.string().required('Behavioral remarks are required'),
  technicalRemarks: Yup.string().required('Technical remarks are required'),
});

export default function EvaluationForm({ candidateId }: EvaluationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useAppDispatch();

  const initialValues = {
    candidateId,
    behavioralRemarks: '',
    technicalRemarks: '',
    date: new Date().toISOString().split('T')[0],
  };

  const handleSubmit = async (values: Omit<Evaluation, 'id'>) => {
    setIsSubmitting(true);
    try {
      await dispatch(createEvaluation(values));
      toast.success('Evaluation created successfully');
    } catch (error) {
      toast.error('Failed to create evaluation');
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
          <Label htmlFor="behavioralRemarks">Behavioral Remarks</Label>
          <Field
            as={Textarea}
            id="behavioralRemarks"
            name="behavioralRemarks"
            placeholder="Communication skills, teamwork, attitude, etc."
            className="min-h-[120px]"
          />
          <ErrorMessage name="behavioralRemarks" component="div" className="text-sm text-red-500" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="technicalRemarks">Technical Remarks</Label>
          <Field
            as={Textarea}
            id="technicalRemarks"
            name="technicalRemarks"
            placeholder="Technical skills, problem-solving abilities, etc."
            className="min-h-[120px]"
          />
          <ErrorMessage name="technicalRemarks" component="div" className="text-sm text-red-500" />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              'Save Evaluation'
            )}
          </Button>
        </div>
      </Form>
    </Formik>
  );
}