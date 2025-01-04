import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Process = () => {
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [aspectX, setAspectX] = useState(1);
  const [aspectY, setAspectY] = useState(1);

  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [grayscale, setGrayscale] = useState(0);
  const [sepia, setSepia] = useState(0);

  // API response state
  const [apiData, setApiData] = useState(null);

  // Feedback modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');

  // State to control feedback button visibility
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);
   console.log(isFeedbackVisible)
  const handleCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.src = url;
    });

  const getCroppedImage = async () => {
    const img = await createImage(image);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    ctx.filter = `
      brightness(${brightness}%)
      contrast(${contrast}%)
      grayscale(${grayscale}%)
      sepia(${sepia}%)
    `;
    ctx.drawImage(
      img,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        const previewUrl = URL.createObjectURL(blob);
        setPreview(previewUrl);
        setCroppedImage(blob);
        resolve(blob);
      }, 'image/jpeg');
    });
  };

  const handleCropAndPreview = async () => {
    await getCroppedImage();
  };

  const handleUpload = async () => {
    if (!croppedImage) return;

    const formData = new FormData();
    formData.append('image_file', croppedImage);

    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/upload_image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setApiData(response.data.image_details); // Store API response data
      setIsFeedbackVisible(true); // Show feedback button upon successful API response
      console.log('API response:', apiData);
    } catch (error) {
      console.error('Error uploading the image', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle feedback submission
  const handleFeedbackSubmit = () => {
    toast.success('Feedback submitted successfully!');
    setIsModalOpen(false);
    setRating(5);
    setFeedbackText('');
  };

  return (
    <div className="container mx-auto p-8 bg-gradient-to-r from-green-400 to-green-600 rounded-xl shadow-lg text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Waste Classification with Artifical Intelligence</h1>
      <p className="text-lg text-center mb-4">Upload an image to classify waste and get recycling instructions.</p>

      <div className="mb-6">
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleCapture}
          className="p-2 rounded border border-gray-300"
        />
      </div>

      {image && (
        <div className="crop-container mb-6" style={{ position: 'relative', width: '100%', height: '500px' }}>
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspectX / aspectY}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
      )}

      {image && (
        <div className="controls mb-6">
          <label className="mr-2">Aspect X: </label>
          <input
            type="number"
            value={aspectX}
            onChange={(e) => setAspectX(Number(e.target.value))}
            className="p-2 rounded border border-gray-300 mb-2 text-black"
          />
          <label className="mr-2 ml-2">Aspect Y: </label>
          <input
            type="number"
            value={aspectY}
            onChange={(e) => setAspectY(Number(e.target.value))}
            className="p-2 rounded border border-gray-300 mb-2 text-black"
          />
        </div>
      )}

      {image && (
        <div className="filters mb-6">
          <h2 className="text-xl font-bold mb-4">Filters</h2>
          <div>
            <label>Brightness: </label>
            <input
              type="range"
              min="0"
              max="200"
              value={brightness}
              onChange={(e) => setBrightness(e.target.value)}
              className="mx-2"
            />
            <span>{brightness}%</span>
          </div>

          <div>
            <label>Contrast: </label>
            <input
              type="range"
              min="0"
              max="200"
              value={contrast}
              onChange={(e) => setContrast(e.target.value)}
              className="mx-2"
            />
            <span>{contrast}%</span>
          </div>

          <div>
            <label>Grayscale: </label>
            <input
              type="range"
              min="0"
              max="100"
              value={grayscale}
              onChange={(e) => setGrayscale(e.target.value)}
              className="mx-2"
            />
            <span>{grayscale}%</span>
          </div>

          <div>
            <label>Sepia: </label>
            <input
              type="range"
              min="0"
              max="100"
              value={sepia}
              onChange={(e) => setSepia(e.target.value)}
              className="mx-2"
            />
            <span>{sepia}%</span>
          </div>
        </div>
      )}

      <div className="controls mb-6">
        <button
          onClick={handleCropAndPreview}
          className="px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
        >
          Preview Crop
        </button>
      </div>

      {preview && (
        <div className="preview mb-6">
          <h2 className="text-xl font-bold">Preview of Processed Image</h2>
          <img src={preview} alt="Cropped Preview" className="rounded-lg shadow-lg mb-4" />
        </div>
      )}

      <div className="controls mb-6">
        <button
          onClick={handleUpload}
          className="px-6 py-3 bg-green-500 text-white rounded-full hover:bg-blue-600 transition"
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload Image'}
        </button>
      </div>

      {apiData && (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div className="absolute inset-0 bg-black opacity-50"></div>
    <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 z-10 transform transition-all duration-500 ease-in-out scale-100">
      <div className="text-center">
        <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-10 bg-gradient-to-r from-green-500 to-green-700 text-transparent bg-clip-text">Classification Complete!</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="relative">
            <span className="absolute -top-3 left-4 bg-white px-2 text-lg font-bold text-green-600">Status</span>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <p className="text-gray-700 font-medium text-lg">{apiData.isWaste}</p>
            </div>
          </div>
          
          <div className="relative">
            <span className="absolute -top-3 left-4 bg-white px-2 text-lg font-bold text-green-600">Instructions</span>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <p className="text-gray-700 font-medium text-lg">{apiData.instructions}</p>
            </div>
          </div>
          
          <div className="relative">
            <span className="absolute -top-3 left-4 bg-white px-2 text-lg font-bold text-green-600">Recyclable</span>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <p className="text-gray-700 font-medium text-lg">{apiData.recyclable}</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center space-x-4 mt-10">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-full hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg"
          >
            Leave Feedback
          </button>
          <button 
            onClick={() => setApiData(null)} 
            className="px-8 py-3 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-full hover:from-green-500 hover:to-green-600 transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg"
          >
            Close Results
          </button>
        </div>
      </div>
    </div>
  </div>
)}

{isModalOpen && (
        <div className="modal bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center">
          <div className="modal-content bg-white p-8 rounded-lg shadow-lg w-1/3">
            <h3 className="text-xl font-bold mb-4 text-black">Rate and Provide Feedback</h3>
            <label className="block mb-2 text-black">Rating (1-5):</label>
            <input
              type="number"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full p-2 rounded border border-gray-300 mb-4 text-black"
              min="1"
              max="5"
            />
            <label className="block mb-2">Your Feedback:</label>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="w-full p-2 rounded border border-gray-300 mb-4 text-black"
              rows="4"
            />
            <div className="flex justify-end">
              <button
                onClick={handleFeedbackSubmit}
                className="px-6 py-3 bg-green-500 text-white rounded-full hover:bg-gray-600"
              >
                Submit
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="ml-4 px-6 py-3 bg-gray-500 text-white rounded-full hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default Process;
