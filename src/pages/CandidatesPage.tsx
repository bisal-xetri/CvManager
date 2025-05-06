import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
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
import { Plus, Search, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import type { Technology, InterviewStatus } from "@/types";

// Number of items per page
const ITEMS_PER_PAGE = 4;

export default function CandidatesPage() {
  const dispatch = useAppDispatch();
  const { candidates, loading, error } = useAppSelector(
    (state) => state.candidates
  );

  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [technologyFilter, setTechnologyFilter] = useState<Technology | "all">(
    "all"
  );
  const [statusFilter, setStatusFilter] = useState<InterviewStatus | "all">(
    "all"
  );
  const [currentPage, setCurrentPage] = useState(1);

  const technologies: Technology[] = [".NET", "ReactJS", "DevOps", "QA"];
  const statuses: InterviewStatus[] = [
    "Shortlisted",
    "First Interview Complete",
    "Second Interview Complete",
    "Hired",
    "Rejected",
    "Blacklisted",
  ];

  // Fetch candidates on mount
  useEffect(() => {
    dispatch(fetchCandidates());
    window.scrollTo(0, 0);
  }, [dispatch]);

  // Update statusFilter based on URL query param
  useEffect(() => {
    const statusFromURL = searchParams.get("status");
    if (statusFromURL) {
      const matched = statuses.find(
        (s) => s.toLowerCase() === statusFromURL.toLowerCase()
      );
      setStatusFilter((matched as InterviewStatus) || "all");
    } else {
      setStatusFilter("all");
    }
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [searchParams]);

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.phone.includes(searchTerm);

    const matchesTechnology =
      technologyFilter === "all" || candidate.technology === technologyFilter;

    const matchesStatus =
      statusFilter === "all" ||
      candidate.interviewStatus.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesTechnology && matchesStatus;
  });

  // Calculate pagination
  const totalItems = filteredCandidates.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCandidates = filteredCandidates.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page when search changes
            }}
            className="pl-10"
          />
        </div>

        <Select
          value={technologyFilter}
          onValueChange={(value) => {
            setTechnologyFilter(value as Technology | "all");
            setCurrentPage(1); // Reset to first page when filter changes
          }}
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
          onValueChange={(value) => {
            setStatusFilter(value as InterviewStatus | "all");
            setCurrentPage(1); // Reset to first page when filter changes
          }}
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
      ) : paginatedCandidates.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xxl:grid-cols-3 gap-4">
            {paginatedCandidates.map((candidate) => (
              <CandidateCard key={candidate.id} candidate={candidate} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                )
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      ) : candidates.length > 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No candidates match your filters</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("");
              setTechnologyFilter("all");
              setStatusFilter("all");
              setCurrentPage(1);
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
