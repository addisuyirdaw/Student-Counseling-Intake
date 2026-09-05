import { useState, useCallback } from 'react';

const initialFormData = {
  studentId: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  department: '',
  departmentCustom: '',
  yearInSchool: '',
  yearCustom: '',
  gpa: '',
  counselingTopic: '',
  topicCustom: '',
  concernDescription: '',
  hadPreviousCounseling: false,
  previousCounselingDetails: '',
  preferredDays: [],
  preferredTimeSlots: [],
  additionalComments: '',
  urgencyLevel: 'MEDIUM',
  consentGiven: false,
  signatureDataUrl: '',
};

export function useForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const updateArrayField = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const setFieldError = useCallback((field, error) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
    setCurrentStep(1);
    setIsSubmitting(false);
  }, []);

  const goToStep = useCallback((step) => {
    setCurrentStep(step);
  }, []);

  return {
    formData,
    errors,
    currentStep,
    isSubmitting,
    updateField,
    updateArrayField,
    setFieldError,
    clearErrors,
    resetForm,
    goToStep,
    setIsSubmitting,
    setErrors,
  };
}