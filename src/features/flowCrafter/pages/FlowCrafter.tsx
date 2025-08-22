import React from "react";
import PromptSteps from "../components/PromptSteps";

export const FlowCrafter: React.FC = () => {
  return (
    <div className="w-full min-h-full border">
      <div className="w-full min-h-full flex gap-2">
        <div className="w-[300px] min-h-full border">
          <PromptSteps />
        </div>
        <div className="w-full min-h-full border"></div>
      </div>
    </div>
  );
};
