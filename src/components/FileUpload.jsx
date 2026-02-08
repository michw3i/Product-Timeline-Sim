import React from 'react';
import { Sparkles, CheckCircle2, XCircle } from 'lucide-react';
import { formatFileSize } from '../utils/fileUtils';
import { ACCEPTED_FILE_TYPES } from '../constants';

const FileUpload = ({ uploadedFile, error, onFileUpload, onRemoveFile }) => {
  return (
    <div className="bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg p-6 hover:border-gray-600 hover:bg-gray-700 transition-all duration-200">
      <label className="block text-sm font-semibold text-gray-100 mb-3">
        📄 Product Document (Optional)
      </label>
      <p className="text-xs text-gray-300 mb-4">
        Upload a PDF or Word document with your product details, roadmap, or specifications for more accurate analysis
      </p>
      {error && (
        <div className="mb-4 p-3 bg-red-800 border border-red-700 rounded text-sm text-red-200">
          {error}
        </div>
      )}

      {!uploadedFile ? (
        <div className="relative">
          <input
            type="file"
            accept={ACCEPTED_FILE_TYPES}
            onChange={onFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg cursor-pointer transition-all"
          >
            <Sparkles className="w-5 h-5 text-gray-200" />
            <span className="text-gray-200 font-semibold">Choose File (PDF, DOC, DOCX)</span>
          </label>
        </div>
      ) : (
        <div className="flex items-center justify-between bg-gray-700 border border-gray-600 rounded px-4 py-3">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-gray-200" />
            <div>
              <div className="text-sm font-semibold text-gray-100">{uploadedFile.name}</div>
              <div className="text-xs text-gray-300">{formatFileSize(uploadedFile.size)}</div>
            </div>
          </div>
          <button
            onClick={onRemoveFile}
            className="text-red-400 hover:text-red-300 transition-colors"
            type="button"
          >
            <XCircle className="w-5 h-5 text-gray-200" />
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
