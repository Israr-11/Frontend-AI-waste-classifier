import { Button } from "flowbite-react";

const HeroSection = () => {
  return (
    <section className="flex justify-center items-center w-full h-[80vh] bg-gradient-to-t from-green-600 to-transparent bg-gradient-animate">
      <div className="text-center px-6 py-7 w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-green-700 mb-4">
          AI Based Waste Classifier
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          A smart tool for recycling waste and promoting eco-friendly recycling. Upload images of waste and get instant recycling instructions.
        </p>
        {/* Using flex for centering the button */}
        <div className="flex justify-center">
          <Button className="bg-green-700 text-white hover:bg-green-800 shadow-lg py-2 px-6 transition-all duration-300 ease-in-out transform hover:scale-105">
            Get Started
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
