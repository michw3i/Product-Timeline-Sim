import React from 'react';
import { BarChart3, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import FileUpload from './FileUpload';
import { INDUSTRIES, TIMEFRAMES, MAX_TIMEFRAME_MONTHS } from '../constants';

const InputForm = ({
  formData,
  uploadedFile,
  fileError,
  loading,
  onFieldUpdate,
  onFileUpload,
  onRemoveFile,
  onSubmit,
  isFormValid
}) => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 mb-12 shadow-sm">
      <h2 className="text-3xl font-bold text-gray-100 mb-2 flex items-center gap-3">
        <BarChart3 className="w-8 h-8 text-gray-200" />
        Scenario Planning Tool
      </h2>
      <p className="text-gray-300 mb-6">Analyze potential outcomes for your product decision</p>

      {uploadedFile && (
        <span className="inline-flex text-xs bg-gray-700 text-gray-100 border border-gray-600 px-3 py-1 rounded-full items-center gap-2 mb-6">
          <CheckCircle2 className="w-3 h-3 text-gray-100" />
          Document Uploaded
        </span>
      )}

      <div className="space-y-6">
        {/* File Upload */}
        <FileUpload
          uploadedFile={uploadedFile}
          error={fileError}
          onFileUpload={onFileUpload}
          onRemoveFile={onRemoveFile}
        />

        {/* Critical Decision */}
        <div>
            <label className="block text-sm font-semibold text-gray-100 mb-2">
            What is your critical decision or challenge? *
          </label>
            <input
            type="text"
            value={formData.decision}
            onChange={(e) => onFieldUpdate('decision', e.target.value)}
            placeholder="e.g., Should we launch premium tier now or wait 6 months?"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-700 transition-colors"
          />
        </div>

        {/* Product Type, Industry, Timeframe */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
              <label className="block text-sm font-semibold text-gray-100 mb-2">
              What are you building or deciding about? {!uploadedFile && '*'}
            </label>
            <input
              type="text"
              value={formData.productType}
              onChange={(e) => onFieldUpdate('productType', e.target.value)}
              placeholder={uploadedFile ? "Auto-detected from file" : "e.g., Premium subscription model"}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-700 transition-colors"
            />
          </div>

          <div>
              <label className="block text-sm font-semibold text-gray-100 mb-2">
              Industry *
            </label>
            <select
              value={formData.industry}
              onChange={(e) => onFieldUpdate('industry', e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-700 transition-colors"
            >
              <option value="">Select industry...</option>
              {INDUSTRIES.map(ind => (
                <option key={ind.value} value={ind.value}>{ind.label}</option>
              ))}
            </select>
          </div>

          <div>
              <label className="block text-sm font-semibold text-gray-100 mb-2">
              Timeframe *
            </label>
            <select
              value={formData.timeframe}
              onChange={(e) => onFieldUpdate('timeframe', e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-700 transition-colors"
            >
              <option value="">Select timeframe...</option>
              {TIMEFRAMES.map(tf => (
                <option key={tf.value} value={tf.value}>{tf.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Custom Industry Input */}
        {formData.industry === 'custom' && (
          <div>
              <label className="block text-sm font-semibold text-gray-100 mb-2">
              Custom Industry *
            </label>
            <input
              type="text"
              value={formData.customIndustry}
              onChange={(e) => onFieldUpdate('customIndustry', e.target.value)}
              placeholder="e.g., Healthcare, E-commerce, SaaS..."
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-700 transition-colors"
            />
          </div>
        )}

        {/* Custom Timeframe Input */}
        {formData.timeframe === 'custom' && (
          <div>
              <label className="block text-sm font-semibold text-gray-100 mb-2">
              Custom Timeframe (Months) *
            </label>
            <input
              type="number"
              min="1"
              max={MAX_TIMEFRAME_MONTHS}
              value={formData.customTimeframe}
              onChange={(e) => onFieldUpdate('customTimeframe', e.target.value)}
              placeholder={`Enter number of months (1-${MAX_TIMEFRAME_MONTHS})`}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-700 transition-colors"
            />
          </div>
        )}

        {/* Additional Context */}
        <div>
            <label className="block text-sm font-semibold text-gray-100 mb-2">
            Additional Context (Optional)
          </label>
          <textarea
            value={formData.context}
            onChange={(e) => onFieldUpdate('context', e.target.value)}
            placeholder="Team size, budget constraints, competitive landscape, regulatory concerns..."
            rows="4"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-700 transition-colors resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={onSubmit}
          disabled={loading || !isFormValid}
          className="w-full bg-gray-700 hover:bg-gray-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-lg"
        >
          {loading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Analyzing scenarios...
            </>
          ) : (
            <>
              <Sparkles className="w-6 h-6" />
              Generate Scenario Analysis
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default InputForm;
