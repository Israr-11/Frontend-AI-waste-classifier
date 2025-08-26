import React, { useState } from "react";
import axios from "axios";

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [imageDetails, setImageDetails] = useState(null);
  const [loading, setLoading] = useState(false); 
  const [feedback, setFeedback] = useState(null); 
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false); 

  const handleCapture = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return;

    const formData = new FormData();
    formData.append("image_file", image);

    setLoading(true); // SET LOADING TO TRUE WHEN STARTING THE UPLOAD

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/upload_image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // SETTING THE IMAGE DETAILS TO THE NESTED IMAGE_DETAILS FROM THE RESPONSE
      setImageDetails(response.data.image_details);
    } catch (error) {
      console.error("Error uploading the image", error);
    } finally {
      setLoading(false); // SET LOADING TO FALSE AFTER THE UPLOAD COMPLETES OR FAILS
    }
  };

  // const getRecyclingInfo = (imageName) => {
  //   console.log("Image name:", imageName);
  //   if (imageName === "Caty.jpg") {
  //     return {
  //       waste: "No",
  //       recyclable: "No",
  //       instructions:
  //         "I have detected that sweet little caty is not waste, so unrecyclable.",
  //     };
  //   } else if (imageName === "Pepsi.jpeg") {
  //     return {
  //       waste: "Yes",
  //       recyclable: "Yes",
  //       instructions:
  //         "This is a Pepsi can. Please rinse it and place it in the recycling bin.",
  //     };
  //   } else {
  //     return {
  //       waste: "Unknown",
  //       recyclable: "Unknown",
  //       instructions:
  //         "The waste type is undetermined. Please check local guidelines for disposal.",
  //     };
  //   }
  // };

  const handleFeedback = (rating) => {
    setFeedback(rating);
    setFeedbackSubmitted(true);
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto", textAlign: "center" }}>
      <h1>Waste Sorting Assistant</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleCapture}
        />
        <br />
        <button type="submit">Upload Image</button>
      </form>
      {loading && (
        <p style={{ marginTop: "100px", fontWeight: "bold", color: "red" }}>
          Processing ⏳
        </p>
      )}{" "}
      {/* SHOW PROCESSING MESSAGE WHILE LOADING */}
      {imageDetails && (
        <div>
          <h2>Image Details:</h2>
          <ul>
            <li>
              <strong>Image Name:</strong> {imageDetails.imageName}
            </li>
            <li>
              <strong>Status:</strong> {imageDetails.status}
            </li>
            <li>
              <strong>Classification:</strong> {imageDetails.classification}
            </li>
            <li>
              <strong>Entry Time:</strong>{" "}
              {new Date(imageDetails.entryTime).toLocaleString()}
            </li>
            <li>
              <strong>Size:</strong> {imageDetails.size} bytes
            </li>
            <li>
              <strong>Resolution:</strong> {imageDetails.resolution}
            </li>
            <li>
              <strong>Format:</strong> {imageDetails.format}
            </li>
            <li>
              <strong>Aspect Ratio:</strong> {imageDetails.aspectRatio}
            </li>
            <li>
              <strong>Clarity Index:</strong>
              {imageDetails.clarityIndex
                ? imageDetails.clarityIndex.toFixed(2)
                : "N/A"}
            </li>
            <li>
              <strong>Color Distribution:</strong>{" "}
              {JSON.stringify(imageDetails.colorDistribution)}
            </li>
            <li>
              <strong>Width:</strong> {imageDetails.width}px
            </li>
            <li>
              <strong>Height:</strong> {imageDetails.height}px
            </li>
          </ul>

          <h2>Recycling Information:</h2>
          {(() => {
            const { waste, recyclable, instructions } = getRecyclingInfo(
              imageDetails.imageName
            );
            return (
              <div>
                <p>
                  <strong>Waste:</strong> {waste}
                </p>
                <p>
                  <strong>Recyclable:</strong> {recyclable}
                </p>
                <p>
                  <strong>Instructions:</strong> {instructions}
                </p>
              </div>
            );
          })()}

          <h2>Feedback:</h2>
          {!feedbackSubmitted ? (
            <div>
              <p>Rate the result out of 10:</p>
              {[...Array(10)].map((_, index) => (
                <button key={index} onClick={() => handleFeedback(index + 1)}>
                  {index + 1}
                </button>
              ))}
            </div>
          ) : (
            <p>Thanks! Feedback submitted: {feedback}/10</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
