"use client";

import { Button } from "./ui/button";

const PurchaseButton = ({ courseId }: { courseId: string }) => {
  return (
    <div>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1.5 text-white
                bg-violet-500/15 hover:text-white border-violet-400/30
                hover:bg-violet-500/25 hover:border-violet-400/50
                transition-all duration-150"
      >
        <span>Purchase Course</span>
      </Button>
    </div>
  );
};

export default PurchaseButton;
