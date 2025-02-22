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
  const [apiData, setApiData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);
  console.log('isFeedbackVisible:', isFeedbackVisible);
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
      setApiData(response.data.image_details);
      setIsFeedbackVisible(true);
    } catch (error) {
      console.error('Error uploading the image', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmit = () => {
    toast.success('Feedback submitted successfully!');
    setIsModalOpen(false);
    setRating(5);
    setFeedbackText('');
  };

  return (
    <div className="container mx-auto p-4 md:p-8 bg-gradient-to-r from-green-400 to-green-600 rounded-xl shadow-lg text-white">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center">Waste Classification with Artificial Intelligence</h1>
      <p className="text-base md:text-lg text-center mb-4">Upload an image to classify waste and get recycling instructions.</p>

      <div className="mb-6">
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleCapture}
          className="w-full p-2 rounded border border-gray-300 text-sm md:text-base"
        />
      </div>

      {image && (
        <div className="crop-container mb-6" style={{ position: 'relative', width: '100%', height: '300px md:h-500px' }}>
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
        <div className="controls mb-6 flex flex-col md:flex-row gap-4 items-center">
          <div className="w-full md:w-1/2">
            <label className="block text-sm md:text-base mb-2">Aspect X:</label>
            <input
              type="number"
              value={aspectX}
              onChange={(e) => setAspectX(Number(e.target.value))}
              className="w-full p-2 rounded border border-gray-300 text-black text-sm md:text-base"
            />
          </div>
          <div className="w-full md:w-1/2">
            <label className="block text-sm md:text-base mb-2">Aspect Y:</label>
            <input
              type="number"
              value={aspectY}
              onChange={(e) => setAspectY(Number(e.target.value))}
              className="w-full p-2 rounded border border-gray-300 text-black text-sm md:text-base"
            />
          </div>
        </div>
      )}

      {image && (
        <div className="filters mb-6 space-y-4">
          <h2 className="text-xl md:text-2xl font-bold mb-4">Filters</h2>
          
          <div className="filter-control">
            <label className="block text-sm md:text-base mb-2">Brightness: {brightness}%</label>
            <input
              type="range"
              min="0"
              max="200"
              value={brightness}
              onChange={(e) => setBrightness(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="filter-control">
            <label className="block text-sm md:text-base mb-2">Contrast: {contrast}%</label>
            <input
              type="range"
              min="0"
              max="200"
              value={contrast}
              onChange={(e) => setContrast(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="filter-control">
            <label className="block text-sm md:text-base mb-2">Grayscale: {grayscale}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={grayscale}
              onChange={(e) => setGrayscale(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="filter-control">
            <label className="block text-sm md:text-base mb-2">Sepia: {sepia}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={sepia}
              onChange={(e) => setSepia(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      )}

      <div className="controls space-y-4 md:space-y-0 md:space-x-4 flex flex-col md:flex-row justify-center">
        <button
          onClick={handleCropAndPreview}
          className="w-full md:w-auto px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition text-sm md:text-base"
        >
          Preview Crop
        </button>

        <button
          onClick={handleUpload}
          className="w-full md:w-auto px-6 py-3 bg-green-800 text-white rounded-full hover:bg-blue-600 transition text-sm md:text-base"
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload Image'}
        </button>
      </div>

      {preview && (
        <div className="preview mt-6">
          <h2 className="text-xl md:text-2xl font-bold mb-4">Preview of Processed Image</h2>
          <img src={preview} alt="Cropped Preview" className="rounded-lg shadow-lg w-full md:max-w-2xl mx-auto" />
        </div>
      )}

      {apiData && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-2xl w-full mx-4 z-10">
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 md:mb-10">
                Classification Complete!
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-left">
                <div className="result-card">
                  <span className="text-green-600 font-bold text-sm md:text-base">Status</span>
                  <p className="text-gray-700">{apiData.isWaste}</p>
                </div>
                
                <div className="result-card">
                  <span className="text-green-600 font-bold text-sm md:text-base">Instructions</span>
                  <p className="text-gray-700">{apiData.instructions}</p>
                </div>
                
                <div className="result-card">
                  <span className="text-green-600 font-bold text-sm md:text-base">Recyclable</span>
                  <p className="text-gray-700">{apiData.recyclable}</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-center gap-4 mt-6 md:mt-10">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="px-6 py-3 bg-yellow-400 text-white rounded-full hover:bg-yellow-500 transition text-sm md:text-base"
                >
                  Leave Feedback
                </button>
                <button 
                  onClick={() => setApiData(null)}
                  className="px-6 py-3 bg-green-400 text-white rounded-full hover:bg-green-500 transition text-sm md:text-base"
                >
                  Close Results
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md relative z-10">
            <h3 className="text-xl font-bold mb-4 text-black">Rate and Provide Feedback</h3>
            
            <label className="block mb-2 text-sm md:text-base text-black">Rating (1-5):</label>
            <input
              type="number"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full p-2 rounded border border-gray-300 mb-4 text-black text-sm md:text-base"
              min="1"
              max="5"
            />
            
            <label className="block mb-2 text-sm md:text-base text-black">Your Feedback:</label>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="w-full p-2 rounded border border-gray-300 mb-4 text-black text-sm md:text-base"
              rows="4"
            />
            
            <div className="flex flex-col md:flex-row gap-4 justify-end">
              <button
                onClick={handleFeedbackSubmit}
                className="px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 text-sm md:text-base"
              >
                Submit
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 text-sm md:text-base"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Process;
