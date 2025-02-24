import { useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function FeedbackForm({ onClose }) {
  const [feedback, setFeedback] = useState("");
  const [correctCategory, setCorrectCategory] = useState("");
  
  // Get all required data from localStorage
  const imageHash = localStorage.getItem('currentImageHash');
  //const prediction = localStorage.getItem('currentPrediction');

  const handleSubmit = async () => {
    const feedbackData = {
      image_hash: imageHash,
      is_correct: feedback, // directly use "Yes" or "No"
      ...(feedback === "No" && { correct_category: correctCategory }) // only include if No
    };

    try {
      await fetch("http://127.0.0.1:8000/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedbackData)
      });
      
      localStorage.removeItem('currentImageHash');
      toast.success('Feedback submitted successfully!');
      onClose();
    } catch (error) {
      toast.error('Error submitting feedback');
      console.error('Error submitting feedback:', error);
    }
};


  return (
    <div className="p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Provide Feedback</h2>
      {/* <p className="mb-4 text-gray-700">Prediction: {prediction}</p> */}
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Is this correct?</label>
        <select 
          onChange={(e) => setFeedback(e.target.value)}
          className="w-full p-2 border rounded-lg text-gray-700"
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      {feedback === "No" && (
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Correct Category</label>
          <select 
            onChange={(e) => setCorrectCategory(e.target.value)}
            className="w-full p-2 border rounded-lg text-gray-700"
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
      )}

      <button 
        onClick={handleSubmit}
        className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
      >
        Submit Feedback
      </button>
    </div>
  );
}

export default FeedbackForm;
