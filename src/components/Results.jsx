import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { modelVersions } from '../components/data/ModelResultsData';

const MetricCard = ({ label, value }) => (
  <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
    <p className="text-xs md:text-sm text-gray-500">{label}</p>
    <p className="text-sm md:text-lg font-semibold text-gray-800">{value}</p>
  </div>
);

const Section = ({ title, content, image, categories, videoUrl }) => (
  <section className="space-y-4">
    <h3 className="text-lg md:text-xl font-semibold text-gray-800">{title}</h3>
    <div className="bg-gray-50 rounded-xl p-4 md:p-6">
      <p className="text-sm md:text-base text-gray-600 mb-4">{content}</p>
      
      {categories && (
        <div className="mb-4">
          <h4 className="text-base md:text-lg font-medium mb-2">Categories:</h4>
          <div className="flex flex-wrap gap-2">
            {categories.map((category, index) => (
              <span 
                key={index}
                className="px-2 md:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs md:text-sm"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-center">
        <img 
          src={image} 
          alt={title} 
          className="rounded-lg shadow-md object-contain w-full md:w-[1000px] h-[200px] md:h-[400px]"
        />
      </div>
      
      {videoUrl && (
        <button 
          className="mt-4 px-4 md:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm md:text-base"
          onClick={() => window.open(videoUrl, '_blank')}
        >
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Watch Video
        </button>
      )}
    </div>
  </section>
);

const ResultsPage = () => {
  const [activeVersion, setActiveVersion] = useState(null);

  const handleVersionClick = (versionId) => {
    if (!activeVersion) {
      setActiveVersion(versionId);
    }
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setActiveVersion(null);
  };

  return (
    <div className="container mx-auto px-2 md:px-4 py-4 md:py-8 min-h-screen bg-gradient-to-b from-white to-gray-50">
      <h1 className="text-2xl md:text-4xl font-bold text-center mb-6 md:mb-12 text-gray-800">
        Model Training Versions
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {modelVersions.map((version) => (
          <div 
            key={version.id} 
            className={`
              rounded-xl border border-gray-200 p-4 md:p-6
              transition-all duration-300 hover:-translate-y-2 hover:shadow-xl
              ${activeVersion === version.id ? 'col-span-full bg-white' : 'cursor-pointer hover:bg-white'}
            `}
            onClick={() => handleVersionClick(version.id)}
          >
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800">Version {version.id}</h2>
              {activeVersion === version.id && (
                <XMarkIcon 
                  className="h-5 w-5 md:h-6 md:w-6 text-gray-500 hover:text-gray-700 cursor-pointer" 
                  onClick={handleClose}
                />
              )}
            </div>
            
            {activeVersion === version.id && (
              <div className="space-y-6 md:space-y-8 animate-fadeIn">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                  <MetricCard label="Date" value={`${version.dateFrom} - ${version.dateTo}`} />
                  <MetricCard label="Accuracy" value={version.metrics.accuracy} />
                  <MetricCard label="Loss" value={version.metrics.loss} />
                  <MetricCard label="Epochs" value={version.metrics.epochs} />
                  <MetricCard label="Total Dataset" value={version.metrics.totalDataset} />
                  <MetricCard label="Batch Size" value={version.metrics.batchSize} />
                  <MetricCard label="Training Set" value={version.metrics.trainingDataset} />
                  <MetricCard label="Test Set" value={version.metrics.testDataset} />
                </div>

                <section className="space-y-3 md:space-y-4">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800">Overview</h3>
                  <p className="text-sm md:text-base text-gray-600">{version.overview}</p>
                </section>

                <Section 
                  title="Dataset and Specifications"
                  content={version.datasetSpecs.description}
                  image={version.datasetSpecs.image}
                  categories={version.datasetSpecs.categories}
                />

                <Section 
                  title="CNN Model"
                  content={version.cnnModel.description}
                  image={version.cnnModel.image}
                />

                <Section 
                  title="Model Training in Progress"
                  content={version.trainingProgress.description}
                  image={version.trainingProgress.image}
                  videoUrl={version.trainingProgress.videoUrl}
                />

                <Section 
                  title="Model Training Results"
                  content={version.results.description}
                  image={version.results.image}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsPage;
