import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import type { OfferTemplate } from "@/types";

interface OfferTemplateFormProps {
  initialValues?: Partial<OfferTemplate>;
  isEditing?: boolean;
  onSubmit?: (
    values: Omit<OfferTemplate, "id"> | OfferTemplate
  ) => Promise<void> | void;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  content: Yup.string().required("Content is required"),
});

export default function OfferTemplateForm({
  initialValues,
  isEditing = false,
  onSubmit,
  onSuccess,
  onCancel,
}: OfferTemplateFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (
    values: Omit<OfferTemplate, "id"> | OfferTemplate
  ) => {
    if (!onSubmit) return;

    setIsSubmitting(true);
    try {
      await onSubmit(values);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        title: initialValues?.title || "",
        content: initialValues?.content || "",
        variables: initialValues?.variables || {
          name: "",
          position: "",
          salary: "",
        },
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {() => (
        <Form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Template Title</Label>
            <Field
              as={Input}
              id="title"
              name="title"
              placeholder="e.g., Standard Software Engineer Offer"
            />
            <ErrorMessage
              name="title"
              component="div"
              className="text-sm text-red-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Template Content</Label>
            <Field
              as={Textarea}
              id="content"
              name="content"
              placeholder="Enter your offer letter template content here..."
              className="min-h-[200px]"
            />
            <div className="text-sm text-gray-500 mt-1">
              Use placeholders like {"{{name}}"}, {"{{position}}"},{" "}
              {"{{salary}}"} for dynamic values
            </div>
            <ErrorMessage
              name="content"
              component="div"
              className="text-sm text-red-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
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
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : isEditing ? (
                "Update Template"
              ) : (
                "Create Template"
              )}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
