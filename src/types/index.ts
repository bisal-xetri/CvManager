// Candidate Types
export interface Candidate {
  id: number | string;
  name: string;
  phone: string;
  email: string;
  technology: Technology;
  level: Level;
  experience: string;
  expectedSalary: string;
  interviewStatus: InterviewStatus;
  references: string;
  notes?: string;
}

export type Technology = '.NET' | 'ReactJS' | 'DevOps' | 'QA';

export type Level = 'Junior' | 'Mid' | 'Senior';

export type InterviewStatus = 
  | 'Shortlisted'
  | 'First Interview Complete'
  | 'Second Interview Complete'
  | 'Hired'
  | 'Rejected'
  | 'Blacklisted';

// Assessment Types
export interface Assessment {
  id: number | string;
  title: string;
  description: string;
  candidateId: number | string;
}

// Evaluation Types
export interface Evaluation {
  id: number | string;
  candidateId: number | string;
  behavioralRemarks: string;
  technicalRemarks: string;
  date: string;
}

// Offer Template Types
export interface OfferTemplate {
  id: number | string;
  title: string;
  content: string;
}

// Interview Schedule Types
export interface InterviewSchedule {
  id: number | string;
  candidateId: number | string;
  date: string;
  interviewers: string[];
  notes?: string;
}

// User Types
export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

// Auth Types
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}