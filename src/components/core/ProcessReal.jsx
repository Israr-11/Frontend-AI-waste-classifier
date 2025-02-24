import React, { useState, useCallback, useEffect} from 'react';
import Cropper from 'react-easy-crop';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FeedbackForm from './FeedBackForm';
import { checkImageQuality, getImageBrightness } from '../core/ImageQualityCheck'


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

const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
// eslint-disable-next-line
const [showCameraSelect, setShowCameraSelect] = useState(false);
const [cameraStream, setCameraStream] = useState(null);

useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
  };
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

// Add these new functions before return statement
const startCamera = async () => {
  try {
    const constraints = {
      video: {
        facingMode: 'environment',
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      }
    };
    
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    const videoElement = document.querySelector('video');
    if (videoElement) {
      videoElement.srcObject = stream;
      videoElement.play();
    }
    setCameraStream(stream);
    return stream;
  } catch (err) {
    console.error("Camera error:", err);
    toast.error("Camera access failed. Please check permissions.");
  }
};

const stopCamera = () => {
  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
    setCameraStream(null);
  }
  setShowCameraSelect(false);
};
// eslint-disable-next-line
const capturePhoto = () => {
  const video = document.querySelector('video');
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);
  
  canvas.toBlob((blob) => {
    setImage(URL.createObjectURL(blob));
    stopCamera();
  }, 'image/jpeg');
};

  // API response state
  const [apiData, setApiData] = useState(null);

  // Feedback modal state
  const [isModalOpen, setIsModalOpen] = useState(false);


  // State to control feedback button visibility
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);
   console.log(isFeedbackVisible)

   // In your handleCapture function:
   const handleCapture = async (e) => {
     const file = e.target.files[0];
     if (file) {
       const qualityCheck = await checkImageQuality(file);
       const brightnessCheck = await getImageBrightness(file);
   
       if (!qualityCheck.isValid) {
         toast.error(qualityCheck.messages.join('\n'));
         return;
       }
   
       if (!brightnessCheck.isAcceptable) {
         toast.warning('Image brightness is not optimal. Please use better lighting.');
         return;
       }
   
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
      // Store image hash in localStorage
      localStorage.setItem('ImagePrediction', response.data);
      setIsFeedbackVisible(true);
    } catch (error) {
      console.error('Error uploading the image', error);
    } finally {
      setLoading(false);
    }
  };
  


  return (
    <div className="container mx-auto p-8 bg-gradient-to-r from-green-400 to-green-600 rounded-xl shadow-lg text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Waste Classification with Artifical Intelligence</h1>
      <p className="text-lg text-center mb-4">Upload an image to classify waste and get recycling instructions.</p>
      {isMobile ? (
        <div className="mb-6">
  <div className="flex flex-col md:flex-row gap-4">
    <button
      onClick={async () => {
        setShowCameraSelect(true);
        await startCamera();
      }}
      className="w-full md:w-1/2 p-4 bg-green-800 rounded-lg text-white hover:bg-green-900 transition flex items-center justify-center gap-2 shadow-lg"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      </svg>
      Take Photo
    </button>
{showCameraSelect && (
  <div className="relative w-full h-[300px] md:h-[400px]">
    <video
      autoPlay
      playsInline
      muted
      ref={video => {
        if (video) {
          video.srcObject = cameraStream;
        }
      }}
      onLoadedMetadata={(e) => e.target.play()}
      className="w-full h-full object-cover rounded-lg"
    />
    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
      <button
        onClick={capturePhoto}
        className="px-6 py-2 bg-green-800 rounded-full text-white hover:bg-green-900 transition"
      >
        Capture
      </button>
      <button
        onClick={stopCamera}
        className="px-6 py-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition"
      >
        Cancel
      </button>
    </div>
  </div>
)}

    <div className="w-full md:w-1/2">
      <input
        type="file"
        accept="image/*"
        onChange={handleCapture}
        className="w-full p-4 rounded-lg border-2 border-dashed border-green-800 text-sm md:text-base file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-800 file:text-white hover:file:bg-green-900"
      />
    </div>
  </div>
</div>
) : (
    // Your existing file input for desktop remains unchanged
    <input
      type="file"
      accept="image/*"
      capture="environment"
      onChange={handleCapture}
      className="p-2 rounded border border-gray-300"
    />
  )}
  
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
  <div className="filters mb-6 p-4 md:p-6 bg-green-800 bg-opacity-20 rounded-xl backdrop-blur-sm">
    <h2 className="text-xl md:text-2xl font-bold mb-6 text-center">Image Filters</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="filter-control bg-white bg-opacity-10 p-4 rounded-lg">
        <label className="flex justify-between items-center text-sm md:text-base mb-2">
          <span>Brightness</span>
          <span className="font-mono">{brightness}%</span>
        </label>
        <input
          type="range"
          min="0"
          max="200"
          value={brightness}
          onChange={(e) => setBrightness(e.target.value)}
          className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer accent-green-800"
        />
      </div>

      <div className="filter-control bg-white bg-opacity-10 p-4 rounded-lg">
        <label className="flex justify-between items-center text-sm md:text-base mb-2">
          <span>Contrast</span>
          <span className="font-mono">{contrast}%</span>
        </label>
        <input
          type="range"
          min="0"
          max="200"
          value={contrast}
          onChange={(e) => setContrast(e.target.value)}
          className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer accent-green-800"
        />
      </div>

      <div className="filter-control bg-white bg-opacity-10 p-4 rounded-lg">
        <label className="flex justify-between items-center text-sm md:text-base mb-2">
          <span>Grayscale</span>
          <span className="font-mono">{grayscale}%</span>
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={grayscale}
          onChange={(e) => setGrayscale(e.target.value)}
          className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer accent-green-800"
        />
      </div>

      <div className="filter-control bg-white bg-opacity-10 p-4 rounded-lg">
        <label className="flex justify-between items-center text-sm md:text-base mb-2">
          <span>Sepia</span>
          <span className="font-mono">{sepia}%</span>
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={sepia}
          onChange={(e) => setSepia(e.target.value)}
          className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer accent-green-800"
        />
      </div>
    </div>
  </div>
)}


      <div className="controls mb-6">
        <button
          onClick={handleCropAndPreview}
          className="w-full md:w-auto px-6 py-3 bg-green-500 text-white rounded-full hover:bg-blue-600 transition touch-action-manipulation"
        >
          Preview Crop
        </button>
      </div>

      {preview && (
        <div className="preview mb-6">
          <h2 className="text-xl font-bold mb-6">Preview of Processed Image</h2>
          <img src={preview} alt="Cropped Preview" className="rounded-lg shadow-lg mb-4" />
        </div>
      )}

<div className="controls mb-6">
  <button
    onClick={handleUpload}
    className="w-full md:w-auto px-6 py-3 bg-green-500 text-white rounded-full hover:bg-blue-600 transition touch-action-manipulation"
    disabled={loading}
    type="button"
    aria-label="Upload Image"
  >
    <span className="pointer-events-none">
      {loading ? 'Uploading...' : 'Upload Image'}
    </span>
  </button>
</div>



      {apiData && (
  <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 overflow-y-auto">
    <div className="absolute inset-0 bg-black opacity-50"></div>
    <div className="bg-white rounded-2xl p-4 md:p-8 max-w-2xl w-full mx-4 z-10 transform transition-all duration-500 ease-in-out scale-100">
      <div className="text-center">
        <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 md:mb-10 bg-gradient-to-r from-green-500 to-green-700 text-transparent bg-clip-text">Classification Complete!</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-left">
          {/* Status Card */}
          <div className="relative p-2">
            <span className="absolute -top-3 left-4 bg-white px-2 text-base md:text-lg font-bold text-green-600">Status</span>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <p className="text-gray-700 font-medium text-sm md:text-lg">{apiData.isWaste}</p>
            </div>
          </div>
          
          {/* Instructions Card */}
          <div className="relative p-2">
            <span className="absolute -top-3 left-4 bg-white px-2 text-base md:text-lg font-bold text-green-600">Instructions</span>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <p className="text-gray-700 font-medium text-sm md:text-lg">{apiData.instructions}</p>
            </div>
          </div>
          
          {/* Recyclable Card */}
          <div className="relative p-2">
            <span className="absolute -top-3 left-4 bg-white px-2 text-base md:text-lg font-bold text-green-600">Recyclable</span>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <p className="text-gray-700 font-medium text-sm md:text-lg">{apiData.recyclable}</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4 mt-6 md:mt-10">
          <button 
            onClick={() => {
              setIsModalOpen(true);
              setApiData(null);
            }}
            className="px-6 md:px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-full hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg text-sm md:text-base"
          >
            Leave Feedback
          </button>
          <button 
            onClick={() => setApiData(null)} 
            className="px-6 md:px-8 py-3 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-full hover:from-green-500 hover:to-green-600 transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg text-sm md:text-base"
          >
            Close Results
          </button>
        </div>
      </div>
    </div>
  </div>
)}

{isModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4">
    <div className="absolute inset-0 bg-black opacity-50"></div>
    <div className="relative bg-white p-4 md:p-8 rounded-lg shadow-lg w-full max-w-md mx-4">
      <FeedbackForm 
        onClose={() => {
          setIsModalOpen(false);
          setApiData(null);
        }}
      />
    </div>
  </div>
)}


      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default Process;
