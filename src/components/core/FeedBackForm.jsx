import { useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Techniques that can be applied through pre-processing
const PREPROCESSING_TECHNIQUES = [
  "Adjust brightness",
  "Adjust contrast",
  "Apply grayscale filter",
  "Apply sepia filter",
  "Crop the image"
];

// Techniques that require taking a new photo
const NEW_PHOTO_TECHNIQUES = [
  "Take photos in good lighting conditions",
  "Ensure the waste item is centered in the frame",
  "Use a plain background when possible",
  "Avoid blurry images by holding your device steady",
  "Try different angles if the item has distinctive features",
  "Clean the item before photographing",
  "Remove packaging or labels if possible"
];

// All techniques combined for the checkbox list
const ALL_TECHNIQUES = [...PREPROCESSING_TECHNIQUES, ...NEW_PHOTO_TECHNIQUES];

function FeedbackForm({ onClose, onAdjustImage }) {
  const [feedback, setFeedback] = useState("");
  const [correctCategory, setCorrectCategory] = useState("");
  const [showTips, setShowTips] = useState(false);
  const [tipDetails, setTipDetails] = useState({
    message: "",
    originalCategory: "",
    correctedCategory: "",
    triedTechniques: [],
    untriedPreprocessing: [],
    untriedNewPhoto: []
  });
  const [triedTechniques, setTriedTechniques] = useState([]);
 
  // Get all required data from localStorage
  const imageHash = localStorage.getItem('currentImageHash');
 
  const handleTechniqueToggle = (technique) => {
    if (triedTechniques.includes(technique)) {
      setTriedTechniques(triedTechniques.filter(t => t !== technique));
    } else {
      setTriedTechniques([...triedTechniques, technique]);
    }
  };

  const handleSubmit = async () => {
    // Convert string "Yes"/"No" to boolean for backend
    const isCorrect = feedback === "Yes";
   
    const feedbackData = {
      image_hash: imageHash,
      is_correct: isCorrect,
      ...(feedback === "No" && {
        correct_category: correctCategory,
        tried_techniques: triedTechniques
      })
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedbackData)
      });
     
      const result = await response.json();
     
      // Handle the enhanced response from the backend
      if (result.status === "SUCCESSFUL") {
        toast.success('Feedback submitted successfully!');
       
        // If the prediction was incorrect and we have improvement tips
        if (!isCorrect && result.message) {
          // Parse the tips from the message
          const tipMessage = result.message;
         
          setTipDetails({
            message: tipMessage,
            originalCategory: result.original_category || "",
            correctedCategory: result.corrected_category || correctCategory,
            triedTechniques: result.tried_techniques || [],
            untriedPreprocessing: result.untried_preprocessing || [],
            untriedNewPhoto: result.untried_new_photo || []
          });
         
          setShowTips(true);
        } else {
          // If no tips or correct prediction, close the form
          localStorage.removeItem('currentImageHash');
          localStorage.removeItem('currentPrediction');
          onClose();
        }
      } else {
        toast.error('Error: ' + result.message);
      }
    } catch (error) {
      toast.error('Error submitting feedback');
      console.error('Error submitting feedback:', error);
    }
  };

  const handlePreprocessImage = () => {
    // Close the modal but keep the image in localStorage
    setShowTips(false);
    
    // Trigger image adjustment UI
    if (typeof onAdjustImage === 'function') {
      onAdjustImage(tipDetails.untriedPreprocessing);
    }
    
    onClose();
  };
 
  const handleTakeNewPhoto = () => {
    // Clear localStorage and reload the page to start fresh
    localStorage.removeItem('currentImageHash');
    localStorage.removeItem('currentPrediction');
    onClose();
    window.location.reload(); // Reload the page to clear the uploaded image
  };

  // If showing image quality tips
  if (showTips) {
    const hasPreprocessingTips = tipDetails.untriedPreprocessing && tipDetails.untriedPreprocessing.length > 0;
    const hasNewPhotoTips = tipDetails.untriedNewPhoto && tipDetails.untriedNewPhoto.length > 0;
   
    return (
      <div className="p-4 bg-white rounded-lg shadow-xl max-w-md w-full mx-auto overflow-auto max-h-[90vh]">
        <h2 className="text-xl font-bold mb-3 text-green-600 text-center">Thank You for Your Feedback</h2>
       
        <div className="mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
          <div className="flex items-center mb-2">
            <div className="w-1/2 text-gray-600 font-semibold">Original:</div>
            <div className="w-1/2 capitalize text-red-500 font-medium">{tipDetails.originalCategory}</div>
          </div>
          <div className="flex items-center">
            <div className="w-1/2 text-gray-600 font-semibold">Corrected:</div>
            <div className="w-1/2 capitalize text-green-500 font-medium">{tipDetails.correctedCategory}</div>
          </div>
        </div>
       
        {hasPreprocessingTips && (
          <div className="mb-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
            <h3 className="font-bold text-blue-700 mb-2 text-sm">Try these adjustments:</h3>
            <ul className="space-y-1">
              {tipDetails.untriedPreprocessing.map((technique, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-1 text-blue-500 font-bold">•</span>
                  <span className="text-gray-700 text-sm">{technique}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
       
        {hasNewPhotoTips && (
          <div className="mb-4 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
            <h3 className="font-bold text-yellow-700 mb-2 text-sm">For a new photo, try:</h3>
            <ul className="space-y-1">
              {tipDetails.untriedNewPhoto.map((technique, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-1 text-yellow-600 font-bold">•</span>
                  <span className="text-gray-700 text-sm">{technique}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
       
        <div className="flex flex-col sm:flex-row gap-2 mt-2">
          {hasPreprocessingTips && (
            <button
              onClick={handlePreprocessImage}
              className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              Adjust Image
            </button>
          )}
         
          {hasNewPhotoTips && (
            <button
              onClick={handleTakeNewPhoto}
              className="flex-1 bg-yellow-500 text-white py-2 px-3 rounded-lg hover:bg-yellow-600 transition-colors font-medium text-sm"
            >
              Take New Photo
            </button>
          )}
         
          {(!hasPreprocessingTips && !hasNewPhotoTips) && (
            <button
              onClick={handleTakeNewPhoto}
              className="flex-1 bg-green-500 text-white py-2 px-3 rounded-lg hover:bg-green-600 transition-colors font-medium text-sm"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  // Regular feedback form
  return (
    <div className="p-4 bg-white rounded-lg shadow-xl max-w-md w-full mx-auto overflow-auto max-h-[90vh]">
      <h2 className="text-xl font-bold mb-3 text-gray-800 text-center">Provide Feedback</h2>
     
      <div className="mb-3">
        <label className="block text-gray-700 font-medium mb-1 text-sm">Is this correct?</label>
        <select
          onChange={(e) => setFeedback(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent transition-all text-sm"
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      {feedback === "No" && (
        <>
          <div className="mb-3">
            <label className="block text-gray-700 font-medium mb-1 text-sm">Correct Category</label>
            <select
              onChange={(e) => setCorrectCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent transition-all text-sm"
            >
              <option value="">Select</option>
              <option value="plastic">Plastic</option>
              <option value="glass">Glass</option>
              <option value="metal">Metal</option>
              <option value="organic">Organic</option>
              <option value="paper">Paper</option>
              <option value="trash">Trash</option>
            </select>
          </div>
         
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1 text-sm">Have you tried any of these techniques?</label>
            <div className="bg-gray-50 p-2 rounded-lg border border-gray-200 max-h-40 overflow-y-auto">
              {ALL_TECHNIQUES.map((technique) => (
                <div key={technique} className="flex items-center mb-1 hover:bg-gray-100 p-1 rounded">
                  <input
                    type="checkbox"
                    id={technique}
                    checked={triedTechniques.includes(technique)}
                    onChange={() => handleTechniqueToggle(technique)}
                    className="mr-2 h-4 w-4 text-green-600 rounded focus:ring-green-500 cursor-pointer"
                  />
                  <label htmlFor={technique} className="text-gray-700 cursor-pointer select-none text-sm">{technique}</label>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <button
        onClick={handleSubmit}
        className={`w-full py-2 px-4 rounded-lg font-medium shadow-md hover:shadow-lg active:translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-green-300 ${
          !feedback || (feedback === "No" && !correctCategory)
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-green-600 text-white hover:bg-green-700"
        }`}
        disabled={!feedback || (feedback === "No" && !correctCategory)}
      >
        Submit Feedback
      </button>
    </div>
  );
}

export default FeedbackForm;
