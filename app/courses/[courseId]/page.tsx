"use client";

import PurchaseButton from "@/components/PurchaseButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import {
  Download,
  FileText,
  FileTextIcon,
  Lock,
  PlayCircle,
} from "lucide-react";
import Image from "next/image";
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

  if (!isLoaded || courseData === undefined) {
    return <CourseDetailSkeleton />;
  }
  return (
    <section className="container mx-auto py-8 px-4">
      <Card className="max-w-md bg-violet-500/15 ring-violet-400/30 ring-3  mx-auto ">
        <CardHeader>
          <Image
            src={courseData?.imageUrl ?? ""}
            alt={courseData?.title ?? "Course image"}
            height={600}
            width={1200}
          />

          <CardContent>
            <CardTitle className="text-xl mb-4 text-white">
              {courseData?.title}
            </CardTitle>

            {userAccess.hasAccess ? (
              <>
                <p className="text-white mb-6">{courseData?.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <Button className="flex items-center justify-center space-x-2">
                    <PlayCircle className="w-5 h-5" />
                    <span>Start Course</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center justify-center space-x-2"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download Materials</span>
                  </Button>
                </div>
                <h3 className="text-xl font-semibold mb-4">Course Modules</h3>
                <ul className="space-y-2">
                  <li className="flex item-center space-x-2">
                    <FileTextIcon className="size-5 text-white" />
                    <span>Introduction to Advanced Patterns </span>
                  </li>
                  <li className="flex item-center space-x-2">
                    <FileText className="size-5 text-white" />
                    <span>Hooks and Custom Hooks </span>
                  </li>
                </ul>
              </>
            ) : (
              <div className="text-center ">
                <div className="flex flex-col items-center space-y-4">
                  <Lock className="size-12 text-white" />
                  <p className="text-lg  text-white">This course is locked.</p>
                  <p className="mb-4 text-white">
                    Enroll in course to access all premium content.
                  </p>
                  <p className="text-2xl text-white font-bold mb-2">
                    {courseData?.price.toFixed(2)}
                  </p>
                  <PurchaseButton courseId={courseId as Id<"courses">} />
                  <div className=" text-red-500 bg-red-100 ring ring-red-500 px-4 py-2 w-full">
                    {" "}
                    demo card, not a real payment
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </CardHeader>
      </Card>
    </section>
  );
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
