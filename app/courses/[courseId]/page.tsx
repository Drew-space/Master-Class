"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { use } from "react";

const CoursePage = ({ params }: { params: Promise<{ courseId: string }> }) => {
  const { courseId } = use(params);
  const { user, isLoaded } = useUser();

  const userData = useQuery(api.users.getUserByClerkId, {
    clerkId: user?.id ?? "",
  });

  const courseData = useQuery(api.courses.getCourseById, {
    courseId: courseId as Id<"courses">,
  });

  const userAccess = useQuery(
    api.users.getUserAcess,
    userData
      ? { userId: userData?._id, courseId: courseId as Id<"courses"> }
      : "skip",
  ) || { hasAccess: false };

  if (!isLoaded) return null;

  if (isLoaded || courseData) {
    return <CourseDetailSkeleton />;
  }
  return <div> page </div>;
};

export default CoursePage;
function CourseDetailSkeleton() {
  return (
    <div className="  container mx-auto py-8 px-4">
      <Card className="bg-violet-500/15 ring-violet-400/30 ring-3 max-w-4xl mx-auto">
        <CardHeader>
          <Skeleton className="w-full bg-violet-500/15 h-150 rounded-md" />
        </CardHeader>
        <CardContent>
          <Skeleton className="bg-violet-500/15 h-10 w-3/4 mb-4" />
          <Skeleton className=" bg-violet-500/15  h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2 bg-violet-500/15 " />
          <Skeleton className="h-4 w-2/3 mb-6 bg-violet-500/15" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Skeleton className=" bg-violet-500/15 h-10 w-full" />
            <Skeleton className="bg-violet-500/15  h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
