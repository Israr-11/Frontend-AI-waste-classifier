import {
  FaTrash,
  FaLeaf,
  FaExclamationCircle,
  FaRecycle,
} from "react-icons/fa";

const WhyThisSection = () => {
  return (
    <section className="bg-gradient-to-r from-green-300 to-blue-500 py-16 px-4 lg:px-20">
      <div className="max-w-screen-xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-8">
          Why we need this?
        </h2>
        <p className="text-lg text-white mb-12">
          Improper recycling practices harm our planet, waste resources, and
          disrupt ecosystems. Here’s how it affects the environment and why
          proper recycling matters.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="flex flex-col items-center text-white">
            <div className="w-20 h-20 bg-white text-green-700 rounded-full flex items-center justify-center mb-4">
              <FaTrash className="text-3xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Waste of Resources</h3>
            <p className="text-center text-lg">
              When recyclable materials like plastic, paper, and glass end up in
              landfills, valuable resources are wasted.
            </p>
          </div>

          <div className="flex flex-col items-center text-white">
            <div className="w-20 h-20 bg-white text-green-700 rounded-full flex items-center justify-center mb-4">
              <FaExclamationCircle className="text-3xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Environmental Hazard</h3>
            <p className="text-center text-lg">
              Improper disposal of waste leads to pollution of water, soil, and
              air, causing long-term damage to ecosystems.
            </p>
          </div>

          <div className="flex flex-col items-center text-white">
            <div className="w-20 h-20 bg-white text-green-700 rounded-full flex items-center justify-center mb-4">
              <FaLeaf className="text-3xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Threat to Wildlife</h3>
            <p className="text-center text-lg">
              Wildlife is harmed by the accumulation of plastic and other
              non-biodegradable waste in natural habitats.
            </p>
          </div>

          <div className="flex flex-col items-center text-white">
            <div className="w-20 h-20 bg-white text-green-700 rounded-full flex items-center justify-center mb-4">
              <FaRecycle className="text-3xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Opportunity to Recycle
            </h3>
            <p className="text-center text-lg">
              Recycling reduces waste, saves energy, and conserves raw
              materials, helping to protect the environment for future
              generations.
            </p>
          </div>
        </div>

        <div className="mt-12 text-white">
          <h3 className="text-2xl font-bold mb-6">
            The Impact of Improper Recycling
          </h3>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="bg-white text-green-700 p-6 rounded-xl shadow-lg max-w-xs mx-auto">
              <h4 className="text-xl font-semibold mb-4">
                Over 8 Million Tons of Plastic
              </h4>
              <p className="text-lg">
                Every year, more than 8 million tons of plastic waste end up in
                our oceans, harming marine life and ecosystems.
              </p>
            </div>

            <div className="bg-white text-green-700 p-6 rounded-xl shadow-lg max-w-xs mx-auto">
              <h4 className="text-xl font-semibold mb-4">
                Less than 30% of Plastic is Recycled
              </h4>
              <p className="text-lg">
                Despite recycling efforts, less than 30% of plastic waste is
                actually recycled, leaving most to pollute the environment.
              </p>
            </div>

            <div className="bg-white text-green-700 p-6 rounded-xl shadow-lg max-w-xs mx-auto">
              <h4 className="text-xl font-semibold mb-4">
                Up to 60% of Landfill Waste is Recyclable
              </h4>
              <p className="text-lg">
                Up to 60% of waste sent to landfills could be recycled if proper
                recycling practices are followed, reducing the strain on
                resources.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyThisSection;
