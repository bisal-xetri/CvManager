import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch } from '@/store';
import { createOfferTemplate, updateOfferTemplate } from '@/store/slices/offerTemplatesSlice';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { OfferTemplate } from '@/types';

interface OfferTemplateFormProps {
  initialValues?: OfferTemplate;
  isEditing?: boolean;
}

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  content: Yup.string().required('Content is required'),
});

export default function OfferTemplateForm({ initialValues, isEditing = false }: OfferTemplateFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useAppDispatch();

  const defaultValues: Omit<OfferTemplate, 'id'> = {
    title: '',
    content: 'Dear {{name}},\n\nWe are pleased to offer you the position of {{position}} at our company with a salary of {{salary}}.\n\nPlease let us know your decision within 7 days.\n\nRegards,\nHR Department',
  };

  const handleSubmit = async (values: Omit<OfferTemplate, 'id'>) => {
    setIsSubmitting(true);
    try {
      if (isEditing && initialValues) {
        await dispatch(updateOfferTemplate({ ...values, id: initialValues.id }));
        toast.success('Offer template updated successfully');
      } else {
        await dispatch(createOfferTemplate(values));
        toast.success('Offer template created successfully');
      }
    } catch (error) {
      toast.error('Failed to save offer template');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Offer Template' : 'Create Offer Template'}</CardTitle>
        <CardDescription>
          Use placeholders like {{name}}, {{position}}, and {{salary}} in your template
        </CardDescription>
      </CardHeader>
      <Formik
        initialValues={initialValues || defaultValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Template Title</Label>
              <Field
                as={Input}
                id="title"
                name="title"
                placeholder="e.g., Junior Developer Offer"
              />
              <ErrorMessage name="title" component="div" className="text-sm text-red-500" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Offer Letter Content</Label>
              <Field
                as={Textarea}
                id="content"
                name="content"
                placeholder="Enter the offer letter template with placeholders"
                className="font-mono min-h-[200px]"
              />
              <ErrorMessage name="content" component="div" className="text-sm text-red-500" />
            </div>

            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <h4 className="text-sm font-medium mb-2">Available Placeholders:</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li><code>{{name}}</code> - Candidate's full name</li>
                <li><code>{{position}}</code> - Job position/title</li>
                <li><code>{{salary}}</code> - Offered salary</li>
              </ul>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>{isEditing ? 'Update Template' : 'Create Template'}</>
              )}
            </Button>
          </CardFooter>
        </Form>
      </Formik>
    </Card>
  );
}