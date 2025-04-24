import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchCandidates } from "@/store/slices/candidatesSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CandidateCard } from "@/components";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Loader2 } from "lucide-react";
import type { Technology, InterviewStatus } from "@/types";

export default function CandidatesPage() {
  const dispatch = useAppDispatch();
  const { candidates, loading, error } = useAppSelector(
    (state) => state.candidates
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [technologyFilter, setTechnologyFilter] = useState<Technology | "all">(
    "all"
  );
  const [statusFilter, setStatusFilter] = useState<InterviewStatus | "all">(
    "all"
  );

  const technologies: Technology[] = [".NET", "ReactJS", "DevOps", "QA"];
  const statuses: InterviewStatus[] = [
    "Shortlisted",
    "First Interview Complete",
    "Second Interview Complete",
    "Hired",
    "Rejected",
    "Blacklisted",
  ];

  useEffect(() => {
    dispatch(fetchCandidates());
  }, [dispatch]);

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.phone.includes(searchTerm);

    const matchesTechnology =
      technologyFilter === "all" || candidate.technology === technologyFilter;
    const matchesStatus =
      statusFilter === "all" || candidate.interviewStatus === statusFilter;

    return matchesSearch && matchesTechnology && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Candidates</h1>
        <Link to="/candidates/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Candidate
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by name, email, or phone"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select
          value={technologyFilter}
          onValueChange={(value) =>
            setTechnologyFilter(value as Technology | "all")
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by technology" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Technologies</SelectItem>
            {technologies.map((tech) => (
              <SelectItem key={tech} value={tech}>
                {tech}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={statusFilter}
          onValueChange={(value) =>
            setStatusFilter(value as InterviewStatus | "all")
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Candidates Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
          <Button
            variant="outline"
            onClick={() => dispatch(fetchCandidates())}
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      ) : filteredCandidates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xxl:grid-cols-3 gap-4">
          {filteredCandidates.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </div>
      ) : candidates.length > 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No candidates match your filters</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("");
              setTechnologyFilter("all");
              setStatusFilter("all");
            }}
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No candidates found</p>
          <Link to="/candidates/new">
            <Button className="mt-4">Add Your First Candidate</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
