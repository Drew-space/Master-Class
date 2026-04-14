import PurchaseButton from "@/components/PurchaseButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { Show, SignInButton } from "@clerk/nextjs";
import { ConvexHttpClient } from "convex/browser";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const courses = await convex.query(api.courses.getCourses);

  return (
    <div className="flex flex-col min-h-screen z-50">
      <main className="grow mx-auto container px-4 py-26 ">
        <div className="text-center text-white mb-4">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
            Forge Your Path in Modern Development{" "}
          </h1>
          <p>
            Master Fullstack skills through engaging, projects-based learning.
            Unlock your potential with MasterClass
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {courses.slice(0, 3).map((course) => (
            <Card
              key={course._id}
              className="flex text-white flex-col  bg-violet-500/15 hover:text-white ring-violet-400/30 ring-1
                hover:bg-violet-500/25 hover:border-violet-400/50
                transition-all duration-150"
            >
              <Link href={`/courses/${course._id}`} className="cursor-pointer">
                <CardHeader>
                  <Image
                    src={course.imageUrl}
                    alt={course.title}
                    width={640}
                    height={360}
                    loading="eager"
                    className="rounded-md object-cover"
                  />
                </CardHeader>
                <CardContent className="grow">
                  <CardTitle className="text-xl mb-2 hover:underline">
                    {course.title}
                  </CardTitle>
                </CardContent>
              </Link>

              <CardFooter className="flex justify-between items-center">
                <Button
                  variant="ghost"
                  className="hover:bg-violet-500/25 hover:text-white ring-violet-400/30 ring-1  text-white text-lg px-3 py-1"
                >
                  ${course.price.toFixed(2)}
                </Button>

                <Show when="signed-in">
                  <PurchaseButton courseId={course._id} />
                </Show>
                <Show when="signed-out">
                  <SignInButton mode="modal">
                    <Button
                      className="flex items-center gap-1.5 text-white
                bg-violet-500/15 hover:text-white border-violet-400/30
                hover:bg-violet-500/25 hover:border-violet-400/50
                transition-all duration-150"
                    >
                      Sign In to Enroll
                    </Button>
                  </SignInButton>
                </Show>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/pro">
            <Button
              size="lg"
              className="group hover:bg-purple-600 transition-colors duration-300"
            >
              Explore Pro Plans
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
