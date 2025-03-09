export const modelVersions = [
    {
      id: 1,
      title: "Version 1",
      dateFrom: "15-01-2025",
      dateTo: "20-01-2025",
      metrics: {
        accuracy: "93.78%",
        loss: "20%",
        epochs: 10,
        totalDataset: 2527,
        batchSize: 32,
        trainingDataset: 2022,
        testDataset: 505,
        Environment: "Google Colab",
        GPU: "Tesla K80",
        Language: "Python",
        Framework: "TensorFlow",
      },
      overview: "This is version 1 of the model training. It was trained on a dataset of 2527 images. The model achieved an accuracy of 93.78% and a loss of 20% after 10 epochs. The dataset was split into a training set of 2022 images and a test set of 505 images. The batch size used for training was 32. The model was trained on a CNN architecture with 5 convolutional layers.",
      datasetSpecs: {
        description: "Dataset of 2527 images with 6 categories. The categories are cardboard, glass, metal, paper, plastic, and trash. The images were collected from various sources and manually labeled. The images were resized to 128x128 pixels. Before training the images were normalized to have values between 0 and 1. The images in dataset were converted to 3x3 grid to visualize as shown below",
        image: "/images/v1/DatasetV1.png",
        categories: ['cardboard', 'glass', 'metal', 'paper', 'plastic', 'trash']
      },
      cnnModel: {
        description: "This is a Convolutional Neural Network (CNN) designed for multi-class image classification. It consists of three convolutional layers (with 32, 64, and 128 filters) that extract features from images, followed by max-pooling layers to reduce spatial dimensions. After flattening the feature maps, the model has a fully connected layer (128 neurons) and an output layer (softmax activation) that classifies images into six categories. The model is trained using the Adam optimizer with sparse categorical cross-entropy loss to improve accuracy",
        image: "/images/v1/CNNV1.png"
      },
      trainingProgress: {
        description: "This CNN model is trained for waste classification with six categories. It consists of three convolutional layers that extract features, followed by max-pooling layers to reduce image size. After flattening, a fully connected layer (128 neurons) and an output layer (softmax activation) classify the images. The model was trained for 10 epochs, reaching 93.78% training accuracy",
        image: "/images/v1/ModelTrainingV1.png",
        videoUrl: "https://drive.google.com/file/d/18Uw9yx1crhqeLmvWn18MzlM6jnBaqdtT/view?usp=sharing"
      },
      results: {
        description: "The graph shows how the model's accuracy and loss change over training epochs. The left plot tracks accuracy, with the training accuracy steadily increasing, while validation accuracy improves initially but then stabilizes. The right plot tracks loss, where training loss consistently decreases, but validation loss starts increasing after a few epochs.",
        image: "/images/v1/AccuracyGraphV1.png"
      }
    },


    {
      id:2,
      title: "Version 2",
      dateFrom: "03-03-2025",
      dateTo: "Present",
      metrics: {
        accuracy: "98.27%",
        loss: "5.39%",
        epochs: 15,
        totalDataset: 20534,
        batchSize: 32,
        trainingDataset: 16428,
        testDataset: 4106,
        Environment: "Google Colab",
        GPU: "Tesla K80",
        Language: "Python",
        Framework: "TensorFlow",
      },
      overview: "This is version 2 of the model training. It was trained on a dataset of 20534 images. The model achieved an accuracy of 98.27% and a loss of 5.39% after 15 epochs. The dataset was split into a training set of 16428 images and a test set of 4106 images. The batch size used for training was 32. The model was trained on a CNN architecture with 5 convolutional layers.",
      datasetSpecs: {
        description: "Dataset of 20534 images with 7 categories. The categories are e-waste, glass, metal, organic, paper, plastic, trash. The images were collected from various sources and manually labeled. The images were resized to 128x128 pixels. Before training the images were normalized to have values between 0 and 1. The images in dataset were converted to 3x3 grid to visualize as shown below",
        image: "/images/v2/DatasetV2.png",
        categories: ['ewaste', 'glass', 'metal', 'organic', 'paper', 'plastic', 'trash']
      },
      cnnModel: {
        description: "This is a Convolutional Neural Network (CNN) designed for multi-class image classification. It consists of three convolutional layers (with 32, 64, and 128 filters) that extract features from images, followed by max-pooling layers to reduce spatial dimensions. After flattening the feature maps, the model has a fully connected layer (128 neurons) and an output layer (softmax activation) that classifies images into six categories. The model is trained using the Adam optimizer with sparse categorical cross-entropy loss to improve accuracy",
        image: "/images/v2/CNNV2.png"
      },
      trainingProgress: {
        description: "This CNN model is trained for waste classification with 7 categories. It consists of three convolutional layers that extract features, followed by max-pooling layers to reduce image size. After flattening, a fully connected layer (128 neurons) and an output layer (softmax activation) classify the images. The model was trained for 15 epochs, reaching 98.27% training accuracy",
        image: "/images/v2/ModelTrainingV2.png",
        videoUrl: "https://drive.google.com/file/d/1vceZk0jiWSzKXqUpG6HGsqfwpd_ePkxf/view?usp=sharing"
      },
      results: {
        description: "The graph shows how the model's accuracy and loss change over training epochs. The left plot tracks accuracy, with the training accuracy steadily increasing, while validation accuracy improves constantly and slowly. The right plot tracks loss, where training loss consistently decreases, but validation loss starts increasing after a few epochs.",
        image: "/images/v2/AccuracyGraphV2.png"
      }
    },


  ];
