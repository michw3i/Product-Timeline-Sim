import React, { useState } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import ScenarioSelector from './components/ScenarioSelector';
import Timeline from './components/Timeline';
import Footer from './components/Footer';
import { useFileUpload } from './hooks/useFileUpload';
import { useFormData } from './hooks/useFormData';
import { generateScenarios } from './services/aiService';
import { generateMockScenarios } from './utils/scenarioUtils';
import './styles/App.css';

function App() {
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState(0);
  const [apiError, setApiError] = useState(null);
  const [lastParams, setLastParams] = useState(null);

  const {
    uploadedFile,
    fileContent,
    error: fileError,
    handleFileUpload,
    removeFile
  } = useFileUpload();

  const {
    formData,
    updateField,
    resetForm,
    getTimeframe,
    getIndustry,
    isValid
  } = useFormData();

  const handleGenerate = async () => {
    setLoading(true);
    setScenarios([]);
    setApiError(null);

    try {
      const timeframe = parseInt(getTimeframe());
      const industry = getIndustry();
      setLastParams({ timeframe, industry });

      const generatedScenarios = await generateScenarios({
        formData,
        uploadedFile,
        fileContent,
        timeframe,
        industry
      });

      setScenarios(generatedScenarios);
    } catch (error) {
      console.error('Error generating scenarios:', error);
      setApiError(error.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setScenarios([]);
    setSelectedScenario(0);
    resetForm();
    removeFile();
    setApiError(null);
  };

  const handleUseMock = () => {
    const timeframe = (lastParams && lastParams.timeframe) || 6;
    const mocked = generateMockScenarios(timeframe);
    setScenarios(mocked);
    setApiError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 font-sans">
      <Header />

      <div className="w-full">
        {scenarios.length === 0 ? (
          <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
            {apiError && (
              <div className="mb-6 p-4 rounded-lg bg-red-900 border border-red-700 text-red-100">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold">AI service error</p>
                    <p className="text-sm mt-1">{apiError}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={handleGenerate} className="px-3 py-2 bg-red-700 hover:bg-red-600 rounded text-sm font-medium">Retry</button>
                    <button onClick={handleUseMock} className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm font-medium">Use mock scenarios</button>
                  </div>
                </div>
              </div>
            )}

            <InputForm
              formData={formData}
              uploadedFile={uploadedFile}
              fileError={fileError}
              loading={loading}
              onFieldUpdate={updateField}
              onFileUpload={handleFileUpload}
              onRemoveFile={removeFile}
              onSubmit={handleGenerate}
              isFormValid={isValid(!!uploadedFile)}
            />
          </div>
        ) : (
          <div className="w-full">
            {/* Timeline at top, full width */}
            <div className="w-full bg-gray-900 border-b border-gray-800 py-8 md:py-12 px-4 md:px-8">
              <Timeline
                scenario={scenarios[selectedScenario]}
                formData={formData}
              />
            </div>

            {/* Scenario selector below timeline */}
            <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-100 mb-6">Explore Alternative Scenarios</h3>
                <ScenarioSelector
                  scenarios={scenarios}
                  selectedScenario={selectedScenario}
                  onSelect={setSelectedScenario}
                />
              </div>

              <button
                onClick={handleReset}
                className="w-full py-3 px-6 bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 rounded-lg transition-colors text-sm font-semibold"
              >
                ← NEW SIMULATION
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default App;
