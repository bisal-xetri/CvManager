import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchOfferTemplates } from "@/store/slices/offerTemplatesSlice";
import { fetchCandidates } from "@/store/slices/candidatesSlice";
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
import { Plus, FileText, Loader2, Mail } from "lucide-react";
import { OfferTemplateForm, OfferGenerator } from "@/components";
import type { Candidate } from "@/types";

import { ScrollArea } from "@/components/ui/scroll-area";

export default function OffersPage() {
  const dispatch = useAppDispatch();
  const { offerTemplates, loading } = useAppSelector(
    (state) => state.offerTemplates
  );
  const { candidates } = useAppSelector((state) => state.candidates);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );

  useEffect(() => {
    dispatch(fetchOfferTemplates());
    dispatch(fetchCandidates());
  }, [dispatch]);

  const handleGenerateOffer = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
  };

  const eligibleCandidates = candidates.filter(
    (candidate) =>
      candidate.interviewStatus === "First Interview Complete" ||
      candidate.interviewStatus === "Second Interview Complete"
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Offers</h1>
        <div className="flex space-x-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                New Template
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle>Create Offer Template</AlertDialogTitle>
                <AlertDialogDescription>
                  Create a new offer letter template
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="py-4">
                <OfferTemplateForm />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Generate Offer
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-lg">
              <AlertDialogHeader>
                <AlertDialogTitle>Select a Candidate</AlertDialogTitle>
                <AlertDialogDescription>
                  Choose a candidate to generate an offer letter for
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 max-h-[400px] overflow-y-auto">
                {eligibleCandidates.length > 0 ? (
                  eligibleCandidates.map((candidate) => (
                    <Button
                      key={candidate.id}
                      variant="outline"
                      className="justify-start h-auto py-3"
                      onClick={() => handleGenerateOffer(candidate)}
                    >
                      <div className="text-left">
                        <p className="font-medium">{candidate.name}</p>
                        <p className="text-xs text-gray-500">
                          {candidate.technology}, {candidate.level}
                        </p>
                      </div>
                    </Button>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-6">
                    <p className="text-gray-500">
                      No eligible candidates found
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Candidates must have completed at least one interview
                    </p>
                  </div>
                )}
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Tabs defaultValue="templates" className="w-full">
        <TabsList className="grid w-full gap-1 grid-cols-2">
          <TabsTrigger value="templates">Offer Templates</TabsTrigger>
          <TabsTrigger value="sent">Sent Offers</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="h-full">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : offerTemplates.length > 0 ? (
            <ScrollArea className="h-[calc(100vh-200px)] pr-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                {offerTemplates.map((template) => (
                  <Card key={template.id}>
                    <CardHeader>
                      <CardTitle>{template.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-32 rounded-md border bg-gray-50 p-3">
                        <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                          {template.content}
                        </pre>
                      </ScrollArea>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-2xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Edit Offer Template
                            </AlertDialogTitle>
                          </AlertDialogHeader>
                          <div className="py-4">
                            <OfferTemplateForm
                              initialValues={template}
                              isEditing={true}
                            />
                          </div>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <Button size="sm">Use Template</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No offer templates found</p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="mt-4">Create Your First Template</Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-2xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Create Offer Template</AlertDialogTitle>
                    <AlertDialogDescription>
                      Create a new offer letter template
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="py-4">
                    <OfferTemplateForm />
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </TabsContent>

        <TabsContent value="sent" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Sent Offer Letters</CardTitle>
              <CardDescription>
                History of offer letters sent to candidates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Mail className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No sent offers yet</p>
                <p className="text-gray-400 text-sm mt-1">
                  Generate and send offers to candidates
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Generate Offer Dialog */}
      {selectedCandidate && (
        <AlertDialog
          open={!!selectedCandidate}
          onOpenChange={() => setSelectedCandidate(null)}
        >
          <AlertDialogContent className="max-w-3xl">
            <AlertDialogHeader>
              <AlertDialogTitle>
                Generate Offer for {selectedCandidate.name}
              </AlertDialogTitle>
              <AlertDialogDescription>
                Create and send an offer letter
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4">
              <OfferGenerator candidate={selectedCandidate} />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
