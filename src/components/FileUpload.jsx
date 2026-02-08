import React from 'react';
import { Sparkles, CheckCircle2, XCircle } from 'lucide-react';
import { formatFileSize } from '../utils/fileUtils';
import { ACCEPTED_FILE_TYPES } from '../constants';

const FileUpload = ({ uploadedFile, error, onFileUpload, onRemoveFile }) => {
  return (
    <div className="bg-black border-2 border-dashed border-gray-700 rounded-lg p-6 hover:border-cyan-500/50 transition-colors">
      <label className="block text-sm font-semibold text-gray-400 mb-3">
        📄 PRODUCT DOCUMENT (OPTIONAL)
      </label>
      <p className="text-xs text-gray-500 mb-4">
        Upload a PDF or Word document with product details, roadmap, or specifications for more accurate scenario generation
      </p>
      
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded text-sm text-red-400">
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
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 hover:from-cyan-600/30 hover:to-blue-600/30 border border-cyan-500/30 rounded cursor-pointer transition-all"
          >
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span className="text-cyan-400 font-semibold">Choose File (PDF, DOC, DOCX)</span>
          </label>
        </div>
      ) : (
        <div className="flex items-center justify-between bg-cyan-500/10 border border-cyan-500/30 rounded px-4 py-3">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-cyan-400" />
            <div>
              <div className="text-sm font-semibold text-gray-100">{uploadedFile.name}</div>
              <div className="text-xs text-gray-400">{formatFileSize(uploadedFile.size)}</div>
            </div>
          </div>
          <button
            onClick={onRemoveFile}
            className="text-red-400 hover:text-red-300 transition-colors"
            type="button"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
