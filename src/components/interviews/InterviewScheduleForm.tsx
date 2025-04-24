import { useState } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { useAppDispatch } from "@/store";
import { createInterviewSchedule } from "@/store/slices/interviewSchedulesSlice";
import { sendInterviewInvitation } from "@/lib/emailjs";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { InterviewSchedule } from "@/types";

interface InterviewScheduleFormProps {
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
}

const validationSchema = Yup.object({
  date: Yup.date().required("Interview date is required"),
  interviewers: Yup.array()
    .of(Yup.string().required("Interviewer name is required"))
    .min(1, "At least one interviewer is required"),
  notes: Yup.string(),
});

export default function InterviewScheduleForm({
  candidateId,
  candidateName,
  candidateEmail,
}: InterviewScheduleFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sendEmail, setSendEmail] = useState(true);
  const dispatch = useAppDispatch();

  const initialValues = {
    candidateId,
    date: new Date().toISOString(),
    interviewers: [""],
    notes: "",
  };

  const handleSubmit = async (values: Omit<InterviewSchedule, "id">) => {
    setIsSubmitting(true);
    try {
      await dispatch(createInterviewSchedule(values));

      if (sendEmail) {
        const interviewDate = format(
          new Date(values.date),
          "EEEE, MMMM d, yyyy"
        );
        const interviewTime = format(new Date(values.date), "h:mm a");

        await sendInterviewInvitation(
          candidateName,
          candidateEmail,
          interviewDate,
          interviewTime,
          "Company Office"
        );
      }

      toast.success("Interview scheduled successfully");
    } catch (error) {
      toast.error("Failed to schedule interview");
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
      {({ values, setFieldValue }) => (
        <Form className="space-y-4">
          <div className="space-y-2">
            <Label>Interview Date & Time</Label>
            <div className="flex space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !values.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {values.date ? (
                      format(new Date(values.date), "PPP")
                    ) : (
                      <span>Select date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={new Date(values.date)}
                    onSelect={(date) =>
                      setFieldValue("date", date?.toISOString() || "")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Input
                type="time"
                value={
                  values.date ? format(new Date(values.date), "HH:mm") : ""
                }
                onChange={(e) => {
                  const [hours, minutes] = e.target.value.split(":");
                  const newDate = new Date(values.date);
                  newDate.setHours(parseInt(hours, 10));
                  newDate.setMinutes(parseInt(minutes, 10));
                  setFieldValue("date", newDate.toISOString());
                }}
                className="w-[120px]"
              />
            </div>
            <ErrorMessage
              name="date"
              component="div"
              className="text-sm text-red-500"
            />
          </div>

          <div className="space-y-2">
            <Label>Interviewers</Label>
            <FieldArray name="interviewers">
              {({ remove, push }) => (
                <div className="space-y-2">
                  {values.interviewers.map((interviewer, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Field
                        as={Input}
                        name={`interviewers.${index}`}
                        placeholder="Enter interviewer name"
                        className="flex-1"
                      />
                      {values.interviewers.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => push("")}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Interviewer
                  </Button>
                </div>
              )}
            </FieldArray>
            <ErrorMessage
              name="interviewers"
              component="div"
              className="text-sm text-red-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Field
              as={Textarea}
              id="notes"
              name="notes"
              placeholder="Any additional information about the interview"
              className="min-h-[80px]"
            />
            <ErrorMessage
              name="notes"
              component="div"
              className="text-sm text-red-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="sendEmail"
              checked={sendEmail}
              onChange={(e) => setSendEmail(e.target.checked)}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="sendEmail" className="text-sm font-normal">
              Send email notification to candidate
            </Label>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Scheduling...
                </>
              ) : (
                "Schedule Interview"
              )}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
