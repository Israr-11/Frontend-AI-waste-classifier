import React from "react";

export default function Disclaimer() {
  return (
    <div className="p-6 max-w-4xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Disclaimer</h1>
      <p className="mb-4">
        The AI Recycling Classifier provides recycling recommendations based on predictions from an image classification model.
        Please note that while we've made every effort to ensure accuracy, the suggestions are not definitive.
      </p>
      <p className="mb-4">
        For approved recycling methods and official guidance, please contact the Irish Environmental Department.
      </p>
      <p>We strive to offer the best results, but this classifier should be used as a guide, not as a final authority.</p>
    </div>
  );
}




