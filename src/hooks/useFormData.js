import { useState } from 'react';

/**
 * Custom hook for managing form state
 * @returns {Object} Form state and handlers
 */
export const useFormData = () => {
  const [formData, setFormData] = useState({
    decision: '',
    productType: '',
    industry: '',
    customIndustry: '',
    timeframe: '',
    customTimeframe: '',
    context: ''
  });

  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      decision: '',
      productType: '',
      industry: '',
      customIndustry: '',
      timeframe: '',
      customTimeframe: '',
      context: ''
    });
  };

  const getTimeframe = () => {
    if (formData.timeframe === 'custom') {
      return formData.customTimeframe || '6';
    }
    return formData.timeframe || '6';
  };

  const getIndustry = () => {
    if (formData.industry === 'custom') {
      return formData.customIndustry || 'General';
    }
    return formData.industry || 'General';
  };

  const isValid = (hasUploadedFile) => {
    const hasDecision = !!formData.decision;
    const hasProductType = hasUploadedFile || !!formData.productType;
    const hasIndustry = !!formData.industry;
    const hasValidIndustry = formData.industry !== 'custom' || !!formData.customIndustry;
    const hasTimeframe = !!formData.timeframe;
    const hasValidTimeframe = formData.timeframe !== 'custom' || !!formData.customTimeframe;

    return hasDecision && hasProductType && hasIndustry && hasValidIndustry && hasTimeframe && hasValidTimeframe;
  };

  return {
    formData,
    updateField,
    resetForm,
    getTimeframe,
    getIndustry,
    isValid
  };
};
