import { Link } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  Phone, 
  Mail, 
  BriefcaseBusiness, 
  BarChart3, 
  Calendar, 
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Candidate } from '@/types';

interface CandidateCardProps {
  candidate: Candidate;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Shortlisted':
      return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200';
    case 'First Interview Complete':
      return 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200';
    case 'Second Interview Complete':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200';
    case 'Hired':
      return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200';
    case 'Rejected':
      return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200';
    case 'Blacklisted':
      return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200';
  }
};

const getTechnologyColor = (technology: string) => {
  switch (technology) {
    case 'ReactJS':
      return 'bg-cyan-100 text-cyan-800 border-cyan-200';
    case '.NET':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'DevOps':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'QA':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getLevelColor = (level: string) => {
  switch (level) {
    case 'Junior':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Mid':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Senior':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default function CandidateCard({ candidate }: CandidateCardProps) {
  return (
    <Link to={`/candidates/${candidate.id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="flex justify-between items-center">
            <span className="line-clamp-1 text-lg">{candidate.name}</span>
            <Badge 
              variant="outline" 
              className={cn("ml-2 whitespace-nowrap font-normal text-xs", getStatusColor(candidate.interviewStatus))}
            >
              {candidate.interviewStatus}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">{candidate.phone}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">{candidate.email}</span>
            </div>
            {candidate.references && (
              <div className="flex items-center text-sm text-gray-600">
                <User className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">Ref: {candidate.references}</span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="pt-0 flex justify-between items-center">
          <div className="flex space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge 
                    variant="outline" 
                    className={cn("font-normal", getTechnologyColor(candidate.technology))}
                  >
                    {candidate.technology}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Technology</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge 
                    variant="outline" 
                    className={cn("font-normal", getLevelColor(candidate.level))}
                  >
                    {candidate.level}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Level</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <BriefcaseBusiness className="h-4 w-4 mr-1 flex-shrink-0" />
            <span>{candidate.experience} {parseInt(candidate.experience) === 1 ? 'yr' : 'yrs'}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}