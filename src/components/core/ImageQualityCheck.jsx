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
      
      // Resize large images for faster processing
      const maxDimension = 1000;
      let width = img.width;
      let height = img.height;
      
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round(height * (maxDimension / width));
          width = maxDimension;
        } else {
          width = Math.round(width * (maxDimension / height));
          height = maxDimension;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Convert to grayscale for better blur detection
      const gray = new Uint8Array(width * height);
      for (let i = 0, j = 0; i < data.length; i += 4, j++) {
        gray[j] = (data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11);
      }
      
      // Laplacian variance for blur detection
      let laplacianVar = 0;
      const kernel = [0, 1, 0, 1, -4, 1, 0, 1, 0]; // Laplacian kernel
      
      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          const idx = y * width + x;
          
          // Apply Laplacian operator
          let sum = 0;
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const kidx = (ky + 1) * 3 + (kx + 1);
              sum += gray[(y + ky) * width + (x + kx)] * kernel[kidx];
            }
          }
          
          laplacianVar += sum * sum;
        }
      }
      
      // Normalize by image size
      const blurScore = laplacianVar / (width * height);
      
      // Lower threshold for better detection
      const threshold = 100; // Adjusted threshold
      
      resolve({
        score: blurScore,
        isSharp: blurScore > threshold,
        message: blurScore > threshold ? "Image is sharp" : "Image is too blurry"
      });
    };

    img.onerror = () => {
      resolve({
        score: 0,
        isSharp: false,
        message: "Failed to analyze image sharpness"
      });
    };

    img.src = objectUrl;
  });
};

  