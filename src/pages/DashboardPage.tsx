import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchCandidates } from "@/store/slices/candidatesSlice";
import { fetchInterviewSchedules } from "@/store/slices/interviewSchedulesSlice";
import { format, isFuture, isToday } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Calendar,
  BarChart3,
  Plus,
  ArrowUpRight,
} from "lucide-react";
import { CandidateCard } from "@/components";

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { candidates } = useAppSelector((state) => state.candidates);
  const { interviewSchedules } = useAppSelector(
    (state) => state.interviewSchedules
  );
  const [statusCounts, setStatusCounts] = useState({
    shortlisted: 0,
    firstInterviewComplete: 0,
    secondInterviewComplete: 0,
    hired: 0,
    rejected: 0,
    blacklisted: 0,
  });

  useEffect(() => {
    dispatch(fetchCandidates());
    dispatch(fetchInterviewSchedules());
  }, [dispatch]);

  useEffect(() => {
    if (candidates.length > 0) {
      const counts = {
        shortlisted: 0,
        firstInterviewComplete: 0,
        secondInterviewComplete: 0,
        hired: 0,
        rejected: 0,
        blacklisted: 0,
      };

      candidates.forEach((candidate) => {
        switch (candidate.interviewStatus) {
          case "Shortlisted":
            counts.shortlisted += 1;
            break;
          case "First Interview Complete":
            counts.firstInterviewComplete += 1;
            break;
          case "Second Interview Complete":
            counts.secondInterviewComplete += 1;
            break;
          case "Hired":
            counts.hired += 1;
            break;
          case "Rejected":
            counts.rejected += 1;
            break;
          case "Blacklisted":
            counts.blacklisted += 1;
            break;
          default:
            break;
        }
      });

      setStatusCounts(counts);
    }
  }, [candidates]);

  const todayInterviews = interviewSchedules.filter((schedule) => {
    const scheduleDate = new Date(schedule.date);
    return isToday(scheduleDate);
  });

  const upcomingInterviews = interviewSchedules
    .filter((schedule) => {
      const scheduleDate = new Date(schedule.date);
      return isFuture(scheduleDate) && !isToday(scheduleDate);
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const recentCandidates = [...candidates]
    .sort((a, b) => {
      // This is a simplification; in a real app, you'd have createdAt timestamps
      // to sort by most recently added
      return parseInt(String(b.id)) - parseInt(String(a.id));
    })
    .slice(0, 4);

  const getCandidateById = (id: string | number) => {
    return candidates.find((candidate) => candidate.id === id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link to="/candidates/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Candidate
          </Button>
        </Link>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  Total Candidates
                </span>
                <Users className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-3xl font-bold">{candidates.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  Shortlisted
                </span>
                <Clock className="h-5 w-5 text-blue-400" />
              </div>
              <p className="text-3xl font-bold">{statusCounts.shortlisted}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  In Interview
                </span>
                <Calendar className="h-5 w-5 text-purple-400" />
              </div>
              <p className="text-3xl font-bold">
                {statusCounts.firstInterviewComplete +
                  statusCounts.secondInterviewComplete}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Hired</span>
                <UserCheck className="h-5 w-5 text-green-400" />
              </div>
              <p className="text-3xl font-bold">{statusCounts.hired}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  Rejected
                </span>
                <UserX className="h-5 w-5 text-red-400" />
              </div>
              <p className="text-3xl font-bold">{statusCounts.rejected}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  Blacklisted
                </span>
                <BarChart3 className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-3xl font-bold">{statusCounts.blacklisted}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Candidates */}
        <Card className="overflow-hidden">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent Candidates</CardTitle>
              <Link to="/candidates">
                <Button size="sm" className="gap-1">
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <CardDescription>
              Latest candidates added to the system
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-1 2xl:grid-cols-2 gap-4 p-6">
              {recentCandidates.length > 0 ? (
                recentCandidates.map((candidate) => (
                  <CandidateCard key={candidate.id} candidate={candidate} />
                ))
              ) : (
                <div className="col-span-2 py-8 text-center text-gray-500">
                  No candidates found
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Today's Interviews */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Today's Interviews</CardTitle>
              <Link to="/interviews">
                <Button size="sm" className="gap-1">
                  View Schedule
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <CardDescription>Scheduled interviews for today</CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            {todayInterviews.length > 0 ? (
              <div className="space-y-4">
                {todayInterviews.map((interview) => {
                  const candidate = getCandidateById(interview.candidateId);
                  if (!candidate) return null;

                  return (
                    <div
                      key={interview.id}
                      className="px-6 py-3 hover:bg-gray-50 transition-colors border-b last:border-0"
                    >
                      <Link
                        to={`/candidates/${candidate.id}`}
                        className="block"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {candidate.name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {candidate.technology}, {candidate.level}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {format(new Date(interview.date), "h:mm a")}
                            </p>
                            <p className="text-xs text-gray-500">
                              {interview.interviewers.join(", ")}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center text-gray-500 px-6">
                <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p>No interviews scheduled for today</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Interviews */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Upcoming Interviews</CardTitle>
              <Link to="/interviews">
                <Button size="sm" className="gap-1">
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <CardDescription>
              Interviews scheduled for the upcoming days
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            {upcomingInterviews.length > 0 ? (
              <div className="space-y-0">
                {upcomingInterviews.slice(0, 5).map((interview) => {
                  const candidate = getCandidateById(interview.candidateId);
                  if (!candidate) return null;

                  return (
                    <div
                      key={interview.id}
                      className="px-6 py-4 hover:bg-gray-50 transition-colors border-b last:border-0"
                    >
                      <Link
                        to={`/candidates/${candidate.id}`}
                        className="block"
                      >
                        <div className="grid grid-cols-12 gap-4">
                          <div className="col-span-5 md:col-span-3">
                            <p className="font-medium text-gray-900">
                              {format(new Date(interview.date), "MMM d, yyyy")}
                            </p>
                            <p className="text-sm text-gray-500">
                              {format(new Date(interview.date), "h:mm a")}
                            </p>
                          </div>
                          <div className="col-span-7 md:col-span-6">
                            <p className="font-medium text-gray-900">
                              {candidate.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {candidate.technology}, {candidate.level}
                            </p>
                          </div>
                          <div className="hidden md:block md:col-span-3 text-right">
                            <p className="text-sm text-gray-500">
                              {interview.interviewers.join(", ")}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center text-gray-500 px-6">
                <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p>No upcoming interviews scheduled</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
