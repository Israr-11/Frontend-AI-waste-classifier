export const basicQualityCheck = async (imageFile) => {
    return new Promise((resolve) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(imageFile);
  
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        
        const quality = {
          isValid: true,
          messages: [],
          metadata: {
            width: img.width,
            height: img.height,
            aspectRatio: img.width / img.height,
            fileSize: imageFile.size / (1024 * 1024)
          }
        };
  
        // Your existing checks for resolution, file size, aspect ratio, and file type
        if (img.width < 640 || img.height < 640) {
          quality.isValid = false;
          quality.messages.push("Image resolution too low. Minimum 640x640 pixels required.");
        }
        // ... rest of your checks ...

        resolve(quality);
      };
      
      img.onerror = () => {
        resolve({
          isValid: false,
          messages: ["Failed to load image"],
          metadata: null
        });
      };
  
      img.src = objectUrl;
    });
};

export const checkImageQuality = async (imageFile) => {
    const [qualityCheck, brightnessCheck, blurCheck] = await Promise.all([
      basicQualityCheck(imageFile),
      getImageBrightness(imageFile),
      detectBlur(imageFile)
    ]);
  
    if (!blurCheck.isSharp) {
      qualityCheck.isValid = false;
      qualityCheck.messages.push("Image is too blurry. Please provide a clearer photo.");
    }
  
    return {
      ...qualityCheck,
      brightness: brightnessCheck,
      sharpness: blurCheck
    };
  };



  export const getImageBrightness = async (imageFile) => {
    return new Promise((resolve) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(imageFile);
  
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
  
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        let brightness = 0;
  
        // Calculate average brightness
        for (let i = 0; i < data.length; i += 4) {
          brightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
        }
        brightness = brightness / (data.length / 4);
  
        resolve({
          value: brightness,
          isAcceptable: brightness > 40 && brightness < 240
        });
      };
  
      img.src = objectUrl;
    });
  };
  

  export const detectBlur = async (imageFile) => {
    return new Promise((resolve) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(imageFile);
  
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
  
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Laplacian variance for blur detection
        let laplacianVar = 0;
        for (let y = 1; y < canvas.height - 1; y++) {
          for (let x = 1; x < canvas.width - 1; x++) {
            const idx = (y * canvas.width + x) * 4;
            const pixel = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
            
            // Apply Laplacian operator
            const laplacian = 
              -pixel + 
              (data[((y-1) * canvas.width + x) * 4] + 
               data[((y+1) * canvas.width + x) * 4] + 
               data[(y * canvas.width + (x-1)) * 4] + 
               data[(y * canvas.width + (x+1)) * 4]) / 4;
            
            laplacianVar += laplacian * laplacian;
          }
        }
        
        const blurScore = laplacianVar / (canvas.width * canvas.height);
        
        resolve({
          score: blurScore,
          isSharp: blurScore > 500, // Threshold for acceptable sharpness
          message: blurScore > 500 ? "Image is sharp" : "Image is too blurry"
        });
      };
  
      img.src = objectUrl;
    });
  };
  