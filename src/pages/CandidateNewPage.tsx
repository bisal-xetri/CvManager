import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CandidateForm } from '@/components';
import { ArrowLeft } from 'lucide-react';

export default function CandidateNewPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => navigate('/candidates')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Candidates
        </Button>
      </div>

      <CandidateForm />
    </div>
  );
}