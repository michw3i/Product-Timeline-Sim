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

    try {
      const timeframe = parseInt(getTimeframe());
      const industry = getIndustry();

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
      // Fallback to mock data
      const timeframe = parseInt(getTimeframe());
      setScenarios(generateMockScenarios(timeframe));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setScenarios([]);
    setSelectedScenario(0);
    resetForm();
    removeFile();
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 font-mono p-4 md:p-8">
      <Header />

      <div className="max-w-7xl mx-auto">
        {scenarios.length === 0 ? (
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
        ) : (
          <div className="space-y-6">
            <ScenarioSelector
              scenarios={scenarios}
              selectedScenario={selectedScenario}
              onSelect={setSelectedScenario}
            />

            <Timeline
              scenario={scenarios[selectedScenario]}
              formData={formData}
            />

            <button
              onClick={handleReset}
              className="w-full py-3 px-6 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded transition-colors text-sm font-semibold"
            >
              ← NEW SIMULATION
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default App;
