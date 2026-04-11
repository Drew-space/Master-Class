"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { PRO_PLANS } from "../constants";
import { Check } from "lucide-react";

const ProPage = () => {
  const { user, isLoaded: isUserLoaded } = useUser();

  const userData = useQuery(
    api.users.getUserByClerkId,
    user ? { clerkId: user?.id } : "skip",
  );

  const UserSubscription = useQuery(
    api.subscriptions.getUserSubscriptionStatus,
    userData ? { userId: userData._id } : "skip",
  );

  const isYearlySubscribtionActive =
    UserSubscription?.status === "active" &&
    UserSubscription?.planType === "year";

  return (
    <div className="mx-auto container px-4 py-16 ,max-w-6xl">
      <h1 className="text-4xl font-bold text-center mb-4 text-white">
        Choose Your Pro Journey
      </h1>
      <p className="text-lg text-center text-gray-300 mb-8">
        Unlock the full potential of our platform with a Pro subscription.
      </p>

      {isUserLoaded && UserSubscription?.status === "active" && (
        <div className="bg-violet-500/15  ring-violet-400/30 p-4 mb-8  ring-l-4  rounded-md">
          <p className="text-xl text-white">
            You have an active{" "}
            <span className="font-semibold"> {UserSubscription.planType}</span>{" "}
            subscription.
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 items-stretch">
        {PRO_PLANS.map((plan) => (
          <Card
            key={plan.id}
            className={`bg-violet-500/15  ring-violet-400/30 ring-2 flex flex-col transition-all duration-300 ${
              plan.highlighted
                ? "border-purple-400 shadow-lg hover:shadow-xl"
                : "hover:border-purple-200 hover:shadow-md"
            }`}
          >
            <CardHeader>
              <CardTitle
                className={`text-2xl ${plan.highlighted ? "text-purple-600" : "text-white"}`}
              >
                {plan.title}
              </CardTitle>

              <CardDescription className="mt-2">
                <span className="text-3xl font-bold text-white">
                  {plan.price}
                </span>
                <span className="text-white ml-1">{plan.period}</span>
              </CardDescription>
            </CardHeader>

            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-center">
                    <Check
                      className={`h-5 w-5 ${plan.highlighted ? "text-purple-500" : "text-green-500"} mr-2 shrink-0`}
                    />
                    <span className="text-white">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProPage;
