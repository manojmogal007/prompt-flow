import React from "react";

interface ContentTakerProps {
  text: any;
}
export const ContentTaker: React.FC<ContentTakerProps> = () => {
  return (
    <div>
      <textarea
        //   type="text"
        // value={formData?.prompt}
        rows={4}
        // onChange={(e) => handleInput(e, "prompt")}
        className="mt-1 block w-full pr-3 py-2 pl-3 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-transparent transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-dark-800 text-gray-900 dark:text-white"
        placeholder="Enter prompt"
      />
    </div>
  );
};
