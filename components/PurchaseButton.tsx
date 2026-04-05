"use client";

import { useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";

const PurchaseButton = ({ courseId }: { courseId: Id<"courses"> }) => {
  const { user } = useUser();

  const createCheckoutSession = useAction(api.stripe.createCheckoutSession);

  const [isLoading, setIsLoading] = useState(false);

  const userData = useQuery(
    api.users.getUserByClerkId,
    user
      ? {
          clerkId: user?.id,
        }
      : "skip",
  );

  const userAccess = useQuery(
    api.users.getUserAcess,
    userData
      ? { userId: userData?._id, courseId: courseId as Id<"courses"> }
      : "skip",
  ) || { hasAccess: false };

  const handlePurchase = async () => {
    if (!user) {
      return alert("Please login to purxhase");
    }
    setIsLoading(true);

    try {
      const { checkoutUrl } = await createCheckoutSession({ courseId });

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error("Failed to create checkout session");
      }
    } catch (error) {
      // todo: handle error

      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  //   if user has not bought any course or is not subscribed
  if (!userAccess.hasAccess) {
    return (
      <Button
        onClick={handlePurchase}
        disabled={isLoading}
        variant="outline"
        size="sm"
        className="flex items-center gap-1.5 text-white
                bg-violet-500/15 hover:text-white border-violet-400/30
                hover:bg-violet-500/25 hover:border-violet-400/50
                transition-all duration-150"
      >
        <span>Enroll Now</span>
      </Button>
    );
  }

  //   if user have access
  if (userAccess.hasAccess) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1.5 text-white
                bg-violet-500/15 hover:text-white border-violet-400/30
                hover:bg-violet-500/25 hover:border-violet-400/50
                transition-all duration-150"
      >
        <span>Enrolled</span>
      </Button>
    );
  }

  if (isLoading) {
    return (
      <Button>
        <Loader2Icon className="mr-2 size-5 animate-spin" />
      </Button>
    );
  }
  //   return (
  //     <div>
  //       <Button
  //         variant="outline"
  //         size="sm"
  //         className="flex items-center gap-1.5 text-white
  //                 bg-violet-500/15 hover:text-white border-violet-400/30
  //                 hover:bg-violet-500/25 hover:border-violet-400/50
  //                 transition-all duration-150"
  //       >
  //         <span>Purchase Course</span>
  //       </Button>
  //     </div>
  //   );
};

export default PurchaseButton;
