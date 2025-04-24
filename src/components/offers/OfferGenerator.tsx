import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAppSelector } from '@/store';
import { sendOfferLetter } from '@/lib/emailjs';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Mail } from 'lucide-react';
import type { Candidate } from '@/types';

interface OfferGeneratorProps {
  candidate: Candidate;
}

const validationSchema = Yup.object({
  templateId: Yup.string().required('Please select a template'),
  position: Yup.string().required('Position is required'),
  salary: Yup.string().required('Salary is required'),
  offerContent: Yup.string().required('Offer content is required'),
});

export default function OfferGenerator({ candidate }: OfferGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { offerTemplates, loading } = useAppSelector((state) => state.offerTemplates);

  const initialValues = {
    templateId: '',
    position: '',
    salary: candidate.expectedSalary,
    offerContent: '',
  };

  const handleGenerate = (values: any, { setFieldValue }: any) => {
    setIsGenerating(true);
    
    try {
      const template = offerTemplates.find(t => t.id.toString() === values.templateId);
      
      if (!template) {
        toast.error('Template not found');
        return;
      }
      
      let content = template.content;
      content = content.replace(/{{name}}/g, candidate.name);
      content = content.replace(/{{position}}/g, values.position);
      content = content.replace(/{{salary}}/g, values.salary);
      
      setFieldValue('offerContent', content);
      toast.success('Offer letter generated successfully');
    } catch (error) {
      toast.error('Failed to generate offer letter');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendEmail = async (values: any) => {
    setIsSending(true);
    
    try {
      const result = await sendOfferLetter(
        candidate.name,
        candidate.email,
        values.offerContent
      );
      
      if (result.success) {
        toast.success('Offer letter sent successfully');
      } else {
        toast.error('Failed to send offer letter');
      }
    } catch (error) {
      toast.error('Failed to send offer letter');
    } finally {
      setIsSending(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (offerTemplates.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <p className="text-gray-500 text-center">No offer templates available</p>
          <p className="text-gray-400 text-sm text-center mt-1">
            Please create templates before generating offer letters
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Offer Letter</CardTitle>
        <CardDescription>
          Create and send an offer letter to {candidate.name}
        </CardDescription>
      </CardHeader>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <CardContent className="space-y-4">
              <Tabs defaultValue="generate">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="generate">Generate Offer</TabsTrigger>
                  <TabsTrigger value="preview">Preview & Send</TabsTrigger>
                </TabsList>
                
                <TabsContent value="generate" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="templateId">Select Template</Label>
                    <Select
                      onValueChange={(value) => setFieldValue('templateId', value)}
                      value={values.templateId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a template" />
                      </SelectTrigger>
                      <SelectContent>
                        {offerTemplates.map((template) => (
                          <SelectItem key={template.id} value={template.id.toString()}>
                            {template.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <ErrorMessage name="templateId" component="div" className="text-sm text-red-500" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="position">Position</Label>
                      <Field
                        as={Input}
                        id="position"
                        name="position"
                        placeholder="e.g., Frontend Developer"
                      />
                      <ErrorMessage name="position" component="div" className="text-sm text-red-500" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="salary">Salary</Label>
                      <Field
                        as={Input}
                        id="salary"
                        name="salary"
                        placeholder="e.g., Rs 45,000"
                      />
                      <ErrorMessage name="salary" component="div" className="text-sm text-red-500" />
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button 
                      type="button" 
                      onClick={() => handleGenerate(values, { setFieldValue })}
                      disabled={isGenerating || !values.templateId || !values.position || !values.salary}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        'Generate Offer Letter'
                      )}
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="preview" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="offerContent">Offer Letter Preview</Label>
                    <Field
                      as={Textarea}
                      id="offerContent"
                      name="offerContent"
                      className="font-mono min-h-[300px]"
                    />
                    <ErrorMessage name="offerContent" component="div" className="text-sm text-red-500" />
                  </div>

                  <div className="pt-2">
                    <Button 
                      type="button" 
                      onClick={() => handleSendEmail(values)}
                      disabled={isSending || !values.offerContent}
                      className="w-full sm:w-auto"
                    >
                      {isSending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Mail className="mr-2 h-4 w-4" />
                          Send to {candidate.email}
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Form>
        )}
      </Formik>
    </Card>
  );
}