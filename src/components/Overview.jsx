import { FaUpload, FaCogs, FaRecycle, FaComments } from 'react-icons/fa';

const OverviewSection = () => {
  return (
    <section className="bg-white py-12 px-4 lg:px-20">
      <div className="max-w-screen-xl mx-auto text-center">
        <h2 className="text-3xl font-semibold text-green-700 mb-8">
          How It Works
        </h2>
        <p className="text-lg text-gray-600 mb-12">
          Our AI-based waste recycling assistant helps you properly recycle waste. Upload an image, let our AI model analyze it, and receive instant recycling instructions. You can also provide feedback to improve the system.
        </p>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-green-100 text-green-700 rounded-full flex items-center justify-center mb-4">
              <FaUpload className="text-2xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Step 1: Upload Image</h3>
            <p className="text-center text-gray-500">
              Upload an image of waste. Our system supports various waste types like plastic, metal, and organic waste.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-green-100 text-green-700 rounded-full flex items-center justify-center mb-4">
              <FaCogs className="text-2xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Step 2: AI Processing</h3>
            <p className="text-center text-gray-500">
              Our AI model processes the image to classify the waste and understand its composition.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-green-100 text-green-700 rounded-full flex items-center justify-center mb-4">
              <FaRecycle className="text-2xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Step 3: Get Instructions</h3>
            <p className="text-center text-gray-500">
              Based on the AI's analysis, you will receive detailed instructions on how to recycle the item correctly.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-green-100 text-green-700 rounded-full flex items-center justify-center mb-4">
              <FaComments className="text-2xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Step 4: Provide Feedback</h3>
            <p className="text-center text-gray-500">
              After receiving the instructions, you can provide feedback to help us improve the AI's recommendations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OverviewSection;
