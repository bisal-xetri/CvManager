import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchInterviewSchedules } from "@/store/slices/interviewSchedulesSlice";
import { fetchCandidates } from "@/store/slices/candidatesSlice";
import { format, isToday, isPast, isFuture, isSameDay } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Loader2,
  Users,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { InterviewScheduleForm } from "@/components";
import type { Candidate } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function InterviewsPage() {
  const dispatch = useAppDispatch();
  const { interviewSchedules, loading } = useAppSelector(
    (state) => state.interviewSchedules
  );
  const { candidates } = useAppSelector((state) => state.candidates);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  useEffect(() => {
    dispatch(fetchInterviewSchedules());
    dispatch(fetchCandidates());
  }, [dispatch]);

  const getCandidateById = (id: string | number) => {
    return candidates.find((candidate) => candidate.id === id);
  };

  const todayInterviews = interviewSchedules.filter((schedule) => {
    const scheduleDate = new Date(schedule.date);
    return isToday(scheduleDate);
  });

  const upcomingInterviews = interviewSchedules.filter((schedule) => {
    const scheduleDate = new Date(schedule.date);
    return isFuture(scheduleDate) && !isToday(scheduleDate);
  });

  const pastInterviews = interviewSchedules.filter((schedule) => {
    const scheduleDate = new Date(schedule.date);
    return isPast(scheduleDate) && !isToday(scheduleDate);
  });

  const getInterviewsForDate = (date: Date) => {
    return interviewSchedules.filter((schedule) => {
      const scheduleDate = new Date(schedule.date);
      return isSameDay(scheduleDate, date);
    });
  };

  const selectedDateInterviews = selectedDate
    ? getInterviewsForDate(selectedDate)
    : [];

  const handleNewInterview = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Interviews</h1>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Interview
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Select a Candidate</AlertDialogTitle>
              <AlertDialogDescription>
                Choose a candidate to schedule an interview with
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 max-h-[400px] overflow-y-auto">
              {candidates.map((candidate) => (
                <Button
                  key={candidate.id}
                  variant="outline"
                  className="justify-start h-auto py-3"
                  onClick={() => handleNewInterview(candidate)}
                >
                  <div className="text-left">
                    <p className="font-medium">{candidate.name}</p>
                    <p className="text-xs text-gray-500">
                      {candidate.technology}, {candidate.level}
                    </p>
                  </div>
                </Button>
              ))}
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Interview Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="today">
            <TabsList className="grid gap-1 grid-cols-3">
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>

            <TabsContent value="today">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-2" />
                    Today's Interviews ({todayInterviews.length})
                  </CardTitle>
                  <CardDescription>
                    {format(new Date(), "EEEE, MMMM d, yyyy")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-0 h-[400px]">
                  {" "}
                  {/* Fixed height container */}
                  <ScrollArea className="h-full pr-3">
                    {" "}
                    {/* Scrollable area with right padding */}
                    {loading ? (
                      <div className="flex justify-center items-center h-full">
                        {" "}
                        {/* Full height loader */}
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : todayInterviews.length > 0 ? (
                      <div className="space-y-4 pb-4">
                        {" "}
                        {/* Added bottom padding */}
                        {todayInterviews
                          .sort(
                            (a, b) =>
                              new Date(a.date).getTime() -
                              new Date(b.date).getTime()
                          )
                          .map((interview) => {
                            const candidate = getCandidateById(
                              interview.candidateId
                            );
                            if (!candidate) return null;

                            return (
                              <Card
                                key={interview.id}
                                className="hover:shadow-sm transition-shadow"
                              >
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-lg flex justify-between items-center">
                                    <div className="flex items-center">
                                      <Clock className="h-5 w-5 mr-2 text-primary" />{" "}
                                      {/* Changed to primary color */}
                                      <span className="font-medium">
                                        {format(
                                          new Date(interview.date),
                                          "h:mm a"
                                        )}
                                      </span>
                                    </div>
                                    {new Date(interview.date) < new Date() && (
                                      <Badge
                                        variant="destructive"
                                        className="ml-2"
                                      >
                                        Ongoing
                                      </Badge>
                                    )}
                                  </CardTitle>
                                  <CardDescription className="flex items-center">
                                    With {interview.interviewers.join(", ")}
                                  </CardDescription>
                                </CardHeader>
                                <CardContent className="pb-3">
                                  <Link
                                    to={`/candidates/${candidate.id}`}
                                    className="flex items-center space-x-2 hover:underline"
                                  >
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">
                                      {candidate.name}
                                    </span>
                                  </Link>
                                  <div className="flex mt-2 space-x-2">
                                    <Badge variant="secondary">
                                      {candidate.technology}
                                    </Badge>
                                    <Badge variant="secondary">
                                      {candidate.level}
                                    </Badge>
                                  </div>
                                  {interview.notes && (
                                    <ScrollArea className="max-h-[80px] mt-2 text-sm text-muted-foreground border rounded-md p-2">
                                      {interview.notes}
                                    </ScrollArea>
                                  )}
                                </CardContent>
                                <CardFooter className="pt-0 flex justify-end">
                                  <Link to={`/candidates/${candidate.id}`}>
                                    <Button size="sm" className="gap-1">
                                      <User className="h-4 w-4" />
                                      View Profile
                                    </Button>
                                  </Link>
                                </CardFooter>
                              </Card>
                            );
                          })}
                      </div>
                    ) : (
                      <div className="text-center h-full flex flex-col justify-center items-center">
                        {" "}
                        {/* Centered empty state */}
                        <CalendarIcon className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          No interviews scheduled for today
                        </p>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="upcoming">
              <Card>
                <CardHeader>
                  <CardTitle>
                    Upcoming Interviews ({upcomingInterviews.length})
                  </CardTitle>
                  <CardDescription>
                    Interviews scheduled for the next few days
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-0 h-[400px]">
                  {" "}
                  {/* Fixed syntax for max-height */}
                  <ScrollArea className="h-full pr-4">
                    {loading ? (
                      <div className="flex justify-center items-center h-[360px]">
                        {" "}
                        {/* Adjusted height */}
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : upcomingInterviews.length > 0 ? (
                      <div className="space-y-4 pb-4">
                        {" "}
                        {/* Added bottom padding */}
                        {upcomingInterviews
                          .sort(
                            (a, b) =>
                              new Date(a.date).getTime() -
                              new Date(b.date).getTime()
                          )
                          .map((interview) => {
                            const candidate = getCandidateById(
                              interview.candidateId
                            );
                            if (!candidate) return null;

                            return (
                              <Card
                                key={interview.id}
                                className="hover:shadow-sm transition-shadow"
                              >
                                {" "}
                                {/* Added hover effect */}
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-lg flex justify-between">
                                    <div className="flex items-center">
                                      <CalendarIcon className="h-5 w-5 mr-2 text-gray-500" />
                                      {format(
                                        new Date(interview.date),
                                        "EEEE, MMMM d, yyyy"
                                      )}
                                    </div>
                                    {new Date(interview.date) < new Date() && (
                                      <Badge
                                        variant="destructive"
                                        className="ml-2"
                                      >
                                        Past Due
                                      </Badge>
                                    )}
                                  </CardTitle>
                                  <CardDescription className="flex items-center">
                                    <Clock className="h-4 w-4 mr-1" />
                                    {format(
                                      new Date(interview.date),
                                      "h:mm a"
                                    )}{" "}
                                    with {interview.interviewers.join(", ")}
                                  </CardDescription>
                                </CardHeader>
                                <CardContent className="pb-3">
                                  <Link
                                    to={`/candidates/${candidate.id}`}
                                    className="flex items-center space-x-2 hover:underline"
                                  >
                                    <Users className="h-4 w-4" />
                                    <span className="font-medium">
                                      {candidate.name}
                                    </span>
                                  </Link>
                                  <div className="flex mt-2 space-x-2">
                                    <Badge variant="outline">
                                      {candidate.technology}
                                    </Badge>
                                    <Badge variant="outline">
                                      {candidate.level}
                                    </Badge>
                                  </div>
                                  {interview.notes && (
                                    <ScrollArea className="max-h-[80px] mt-2 text-sm text-muted-foreground border rounded-md p-2">
                                      {interview.notes}
                                    </ScrollArea>
                                  )}
                                </CardContent>
                                <CardFooter className="pt-0 flex justify-end space-x-2">
                                  <Button variant="outline" size="sm">
                                    Reschedule
                                  </Button>
                                  <Link to={`/candidates/${candidate.id}`}>
                                    <Button size="sm">View Candidate</Button>
                                  </Link>
                                </CardFooter>
                              </Card>
                            );
                          })}
                      </div>
                    ) : (
                      <div className="text-center h-[360px] flex flex-col justify-center">
                        {" "}
                        {/* Centered empty state */}
                        <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">
                          No upcoming interviews scheduled
                        </p>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="past">
              <Card>
                <CardHeader>
                  <CardTitle>
                    Past Interviews ({pastInterviews.length})
                  </CardTitle>
                  <CardDescription>
                    Previously conducted interviews
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-0 h-[400px]">
                  <ScrollArea className="h-full pr-4">
                    {loading ? (
                      <div className="flex justify-center items-center py-12 h-full">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : pastInterviews.length > 0 ? (
                      <div className="space-y-4">
                        {pastInterviews
                          .sort(
                            (a, b) =>
                              new Date(b.date).getTime() -
                              new Date(a.date).getTime()
                          )
                          .slice(0, 5)
                          .map((interview) => {
                            const candidate = getCandidateById(
                              interview.candidateId
                            );
                            if (!candidate) return null;

                            return (
                              <Card key={interview.id} className="bg-gray-50">
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-lg flex justify-between">
                                    <div className="flex items-center">
                                      <CalendarIcon className="h-5 w-5 mr-2 text-gray-500" />
                                      {format(
                                        new Date(interview.date),
                                        "EEEE, MMMM d, yyyy"
                                      )}
                                    </div>
                                  </CardTitle>
                                  <CardDescription className="flex items-center">
                                    <Clock className="h-4 w-4 mr-1" />
                                    {format(
                                      new Date(interview.date),
                                      "h:mm a"
                                    )}{" "}
                                    with {interview.interviewers.join(", ")}
                                  </CardDescription>
                                </CardHeader>
                                <CardContent className="pb-3">
                                  <Link
                                    to={`/candidates/${candidate.id}`}
                                    className="flex items-center space-x-2 hover:underline"
                                  >
                                    <Users className="h-4 w-4" />
                                    <span className="font-medium">
                                      {candidate.name}
                                    </span>
                                  </Link>
                                  <div className="flex mt-2 space-x-2">
                                    <Badge variant="outline">
                                      {candidate.technology}
                                    </Badge>
                                    <Badge variant="outline">
                                      {candidate.level}
                                    </Badge>
                                  </div>
                                </CardContent>
                                <CardFooter className="pt-0 flex justify-end">
                                  <Link to={`/candidates/${candidate.id}`}>
                                    <Button variant="outline" size="sm">
                                      View Candidate
                                    </Button>
                                  </Link>
                                </CardFooter>
                              </Card>
                            );
                          })}
                      </div>
                    ) : (
                      <div className="text-center py-12 h-full">
                        <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">
                          No past interviews found
                        </p>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card className="max-h[100px]">
            <CardHeader>
              <CardTitle>Interview Calendar</CardTitle>
              <CardDescription>
                Select a date to view scheduled interviews
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </CardContent>
          </Card>

          {selectedDate && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">
                  {format(selectedDate, "MMMM d, yyyy")}
                </CardTitle>
                <CardDescription>
                  {selectedDateInterviews.length === 0
                    ? "No interviews scheduled"
                    : `${selectedDateInterviews.length} interview${
                        selectedDateInterviews.length > 1 ? "s" : ""
                      } scheduled`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedDateInterviews.length > 0 ? (
                  <div className="space-y-4">
                    {selectedDateInterviews
                      .sort(
                        (a, b) =>
                          new Date(a.date).getTime() -
                          new Date(b.date).getTime()
                      )
                      .map((interview) => {
                        const candidate = getCandidateById(
                          interview.candidateId
                        );
                        if (!candidate) return null;

                        return (
                          <div
                            key={interview.id}
                            className="border rounded-md p-3 bg-gray-50"
                          >
                            <p className="text-sm font-medium">
                              {format(new Date(interview.date), "h:mm a")}
                            </p>
                            <Link
                              to={`/candidates/${candidate.id}`}
                              className="text-sm hover:underline"
                            >
                              {candidate.name}
                            </Link>
                            <p className="text-xs text-gray-500 mt-1">
                              {interview.interviewers.join(", ")}
                            </p>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-sm">
                      No interviews scheduled for this date
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* New Interview Dialog */}
      {selectedCandidate && (
        <AlertDialog
          open={!!selectedCandidate}
          onOpenChange={() => setSelectedCandidate(null)}
        >
          <AlertDialogContent className="max-w-lg">
            <AlertDialogHeader>
              <AlertDialogTitle>
                Schedule Interview with {selectedCandidate.name}
              </AlertDialogTitle>
              <AlertDialogDescription>
                Set up interview date, time and interviewers
              </AlertDialogDescription>
            </AlertDialogHeader>
            <InterviewScheduleForm
              candidateId={selectedCandidate.id.toString()}
              candidateName={selectedCandidate.name}
              candidateEmail={selectedCandidate.email}
            />
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
