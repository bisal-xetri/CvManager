import emailjs from 'emailjs-com';

// Initialize EmailJS with your user ID
export const initEmailJS = () => {
  const userId = import.meta.env.VITE_EMAILJS_USER_ID || "demo_user_id";
  emailjs.init(userId);
};

// Send an email
export const sendEmail = async (templateId: string, templateParams: Record<string, unknown>, serviceId: string) => {
  try {
    const response = await emailjs.send(
      serviceId,
      templateId,
      templateParams
    );
    return { success: true, response };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
};

// Send interview invitation
export const sendInterviewInvitation = async (
  candidateName: string,
  candidateEmail: string,
  interviewDate: string,
  interviewTime: string,
  interviewLocation: string
) => {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || "demo_service";
  const templateId = import.meta.env.VITE_EMAILJS_INTERVIEW_TEMPLATE_ID || "demo_template";

  const templateParams = {
    to_name: candidateName,
    to_email: candidateEmail,
    interview_date: interviewDate,
    interview_time: interviewTime,
    interview_location: interviewLocation,
  };

  return sendEmail(templateId, templateParams, serviceId);
};

// Send offer letter
export const sendOfferLetter = async (
  candidateName: string,
  candidateEmail: string,
  offerContent: string
) => {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || "demo_service";
  const templateId = import.meta.env.VITE_EMAILJS_OFFER_TEMPLATE_ID || "demo_template";

  const templateParams = {
    to_name: candidateName,
    to_email: candidateEmail,
    offer_content: offerContent,
  };

  return sendEmail(templateId, templateParams, serviceId);
};