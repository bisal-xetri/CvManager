import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchCandidateById } from '@/store/slices/candidatesSlice';
import { Button } from '@/components/ui/button';
import { CandidateForm } from '@/components';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

export default function CandidateEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { candidate, loading, error } = useAppSelector((state) => state.candidates);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchCandidateById(id))
        .then(() => setIsLoaded(true));
    }
  }, [dispatch, id]);

  if (loading && !isLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Candidate</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => navigate('/candidates')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Candidates
        </Button>
      </div>
    );
  }

  if (!candidate && isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <AlertCircle className="h-12 w-12 text-amber-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Candidate Not Found</h2>
        <p className="text-gray-600 mb-4">
          The candidate you're trying to edit doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate('/candidates')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Candidates
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => navigate(`/candidates/${id}`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Candidate
        </Button>
      </div>

      {candidate && <CandidateForm initialValues={candidate} isEditing={true} />}
    </div>
  );
}