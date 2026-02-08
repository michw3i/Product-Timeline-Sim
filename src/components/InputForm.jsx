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
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 md:p-8 mb-8">
      <h2 className="text-2xl font-bold text-cyan-400 mb-6 flex items-center gap-2">
        <BarChart3 className="w-6 h-6" />
        INPUT PARAMETERS
        {uploadedFile && (
          <span className="ml-auto text-xs bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Document Uploaded
          </span>
        )}
      </h2>

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
          <label className="block text-sm font-semibold text-gray-400 mb-2">
            CRITICAL DECISION *
          </label>
          <input
            type="text"
            value={formData.decision}
            onChange={(e) => onFieldUpdate('decision', e.target.value)}
            placeholder="e.g., Should we launch premium tier now or wait 6 months?"
            className="w-full bg-black border border-gray-700 rounded px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Product Type, Industry, Timeframe */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">
              PRODUCT TYPE {!uploadedFile && '*'}
            </label>
            <input
              type="text"
              value={formData.productType}
              onChange={(e) => onFieldUpdate('productType', e.target.value)}
              placeholder={uploadedFile ? "Auto-detected from file" : "e.g., Mobile banking app"}
              className="w-full bg-black border border-gray-700 rounded px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">
              INDUSTRY *
            </label>
            <select
              value={formData.industry}
              onChange={(e) => onFieldUpdate('industry', e.target.value)}
              className="w-full bg-black border border-gray-700 rounded px-4 py-3 text-gray-100 focus:outline-none focus:border-cyan-500 transition-colors"
            >
              <option value="">Select industry...</option>
              {INDUSTRIES.map(ind => (
                <option key={ind.value} value={ind.value}>{ind.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">
              TIMEFRAME *
            </label>
            <select
              value={formData.timeframe}
              onChange={(e) => onFieldUpdate('timeframe', e.target.value)}
              className="w-full bg-black border border-gray-700 rounded px-4 py-3 text-gray-100 focus:outline-none focus:border-cyan-500 transition-colors"
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
            <label className="block text-sm font-semibold text-gray-400 mb-2">
              CUSTOM INDUSTRY *
            </label>
            <input
              type="text"
              value={formData.customIndustry}
              onChange={(e) => onFieldUpdate('customIndustry', e.target.value)}
              placeholder="e.g., Healthcare, E-commerce, SaaS..."
              className="w-full bg-black border border-gray-700 rounded px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        )}

        {/* Custom Timeframe Input */}
        {formData.timeframe === 'custom' && (
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">
              CUSTOM TIMEFRAME (MONTHS) *
            </label>
            <input
              type="number"
              min="1"
              max={MAX_TIMEFRAME_MONTHS}
              value={formData.customTimeframe}
              onChange={(e) => onFieldUpdate('customTimeframe', e.target.value)}
              placeholder={`Enter number of months (1-${MAX_TIMEFRAME_MONTHS})`}
              className="w-full bg-black border border-gray-700 rounded px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        )}

        {/* Additional Context */}
        <div>
          <label className="block text-sm font-semibold text-gray-400 mb-2">
            ADDITIONAL CONTEXT
          </label>
          <textarea
            value={formData.context}
            onChange={(e) => onFieldUpdate('context', e.target.value)}
            placeholder="Team size, budget constraints, competitive landscape, regulatory concerns..."
            rows="4"
            className="w-full bg-black border border-gray-700 rounded px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={onSubmit}
          disabled={loading || !isFormValid}
          className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded transition-all duration-300 flex items-center justify-center gap-2 text-lg"
        >
          {loading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              SIMULATING FUTURES...
            </>
          ) : (
            <>
              <Sparkles className="w-6 h-6" />
              GENERATE MULTIVERSE SCENARIOS
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default InputForm;
