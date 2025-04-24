import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch } from '@/store';
import { createCandidate, updateCandidate } from '@/store/slices/candidatesSlice';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import type { Candidate, Technology, Level, InterviewStatus } from '@/types';

interface CandidateFormProps {
  initialValues?: Candidate;
  isEditing?: boolean;
}

const technologies: Technology[] = ['.NET', 'ReactJS', 'DevOps', 'QA'];
const levels: Level[] = ['Junior', 'Mid', 'Senior'];
const interviewStatuses: InterviewStatus[] = [
  'Shortlisted',
  'First Interview Complete',
  'Second Interview Complete',
  'Hired',
  'Rejected',
  'Blacklisted',
];

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  phone: Yup.string().required('Phone number is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  technology: Yup.string().required('Technology is required'),
  level: Yup.string().required('Level is required'),
  experience: Yup.string().required('Experience is required'),
  expectedSalary: Yup.string().required('Expected salary is required'),
  interviewStatus: Yup.string().required('Interview status is required'),
  references: Yup.string(),
  notes: Yup.string(),
});

export default function CandidateForm({ initialValues, isEditing = false }: CandidateFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const defaultValues: Omit<Candidate, 'id'> = {
    name: '',
    phone: '',
    email: '',
    technology: 'ReactJS',
    level: 'Junior',
    experience: '',
    expectedSalary: '',
    interviewStatus: 'Shortlisted',
    references: '',
    notes: '',
  };

  const handleSubmit = async (values: Omit<Candidate, 'id'>) => {
    setIsSubmitting(true);
    try {
      if (isEditing && initialValues) {
        await dispatch(updateCandidate({ ...values, id: initialValues.id }));
        toast.success('Candidate updated successfully');
      } else {
        await dispatch(createCandidate(values));
        toast.success('Candidate created successfully');
      }
      navigate('/candidates');
    } catch (error) {
      toast.error('Failed to save candidate');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Candidate' : 'Add New Candidate'}</CardTitle>
        <CardDescription>
          {isEditing
            ? 'Update candidate information'
            : 'Fill in the form to add a new candidate'}
        </CardDescription>
      </CardHeader>
      <Formik
        initialValues={initialValues || defaultValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <Form>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name (Nepali)</Label>
                  <Field
                    as={Input}
                    id="name"
                    name="name"
                    placeholder="Enter candidate's full name"
                  />
                  <ErrorMessage name="name" component="div" className="text-sm text-red-500" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Field
                    as={Input}
                    id="phone"
                    name="phone"
                    placeholder="e.g., 9865369089"
                  />
                  <ErrorMessage name="phone" component="div" className="text-sm text-red-500" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Field
                    as={Input}
                    id="email"
                    name="email"
                    type="email"
                    placeholder="candidate@example.com"
                  />
                  <ErrorMessage name="email" component="div" className="text-sm text-red-500" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="technology">Technology</Label>
                  <Select
                    defaultValue={values.technology}
                    onValueChange={(value) => setFieldValue('technology', value)}
                  >
                    <SelectTrigger id="technology">
                      <SelectValue placeholder="Select technology" />
                    </SelectTrigger>
                    <SelectContent>
                      {technologies.map((tech) => (
                        <SelectItem key={tech} value={tech}>
                          {tech}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <ErrorMessage name="technology" component="div" className="text-sm text-red-500" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level">Level</Label>
                  <Select
                    defaultValue={values.level}
                    onValueChange={(value) => setFieldValue('level', value)}
                  >
                    <SelectTrigger id="level">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {levels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <ErrorMessage name="level" component="div" className="text-sm text-red-500" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Experience (years)</Label>
                  <Field
                    as={Input}
                    id="experience"
                    name="experience"
                    placeholder="e.g., 2"
                  />
                  <ErrorMessage name="experience" component="div" className="text-sm text-red-500" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expectedSalary">Expected Salary (NPR ₹)</Label>
                  <Field
                    as={Input}
                    id="expectedSalary"
                    name="expectedSalary"
                    placeholder="e.g., Rs 45,000"
                  />
                  <ErrorMessage name="expectedSalary" component="div" className="text-sm text-red-500" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interviewStatus">Interview Status</Label>
                  <Select
                    defaultValue={values.interviewStatus}
                    onValueChange={(value) => setFieldValue('interviewStatus', value)}
                  >
                    <SelectTrigger id="interviewStatus">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {interviewStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <ErrorMessage name="interviewStatus" component="div" className="text-sm text-red-500" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="references">References</Label>
                  <Field
                    as={Input}
                    id="references"
                    name="references"
                    placeholder="Any referrals or references"
                  />
                  <ErrorMessage name="references" component="div" className="text-sm text-red-500" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Field
                  as={Textarea}
                  id="notes"
                  name="notes"
                  placeholder="Additional notes about the candidate"
                  className="min-h-[100px]"
                />
                <ErrorMessage name="notes" component="div" className="text-sm text-red-500" />
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/candidates')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    {isEditing ? 'Updating...' : 'Saving...'}
                  </>
                ) : (
                  <>{isEditing ? 'Update Candidate' : 'Add Candidate'}</>
                )}
              </Button>
            </CardFooter>
          </Form>
        )}
      </Formik>
    </Card>
  );
}