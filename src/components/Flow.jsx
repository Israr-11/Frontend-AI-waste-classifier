import React from "react";
import {
  FaUpload,
  FaImage,
  FaCheck,
  FaSearch,
  FaDatabase,
  FaThumbsUp,
} from "react-icons/fa";

const Flow = () => {
  const steps = [
    {
      id: 1,
      title: "Image Upload",
      icon: <FaUpload />,
      description:
        "User uploads an image for classification. The quality of the image is checked by the Python backend.",
      bgColor: "bg-green-500",
    },
    {
      id: 2,
      title: "Quality Check",
      icon: <FaCheck />,
      description:
        "If the image quality is low, the user is prompted to crop or enhance it before proceeding.",
      bgColor: "bg-yellow-500",
    },
    {
      id: 3,
      title: "Bounding Box Creation",
      icon: <FaImage />,
      description:
        "Using OpenCV, a bounding box is created around the primary object in the image.",
      bgColor: "bg-blue-500",
    },
    {
      id: 4,
      title: "Feature Extraction & Classification",
      icon: <FaSearch />,
      description:
        "TensorFlow extracts features from the image and classifies the waste type.",
      bgColor: "bg-indigo-500",
    },
    {
      id: 5,
      title: "Database Query",
      icon: <FaDatabase />,
      description:
        "The classified waste type is matched in the database to retrieve recycling instructions.",
      bgColor: "bg-purple-500",
    },
    {
      id: 6,
      title: "Results & Feedback",
      icon: <FaThumbsUp />,
      description:
        "The user sees the result and can provide feedback to improve future classifications.",
      bgColor: "bg-red-500",
    },
  ];

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-green-700 mb-8 text-center">
        Technical Workflow Overview
      </h1>

      {/* STEP CARDS */}
      <div className="space-y-8">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`p-6 rounded-lg shadow-lg flex flex-col sm:flex-row items-center ${step.bgColor} text-white`}
          >
            <div className="text-4xl mb-4 sm:mb-0 sm:mr-4">{step.icon}</div>
            <div>
              <h2 className="text-2xl font-semibold">{step.title}</h2>
              <p className="mt-2">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Flow;
