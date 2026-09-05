import { useForm } from '../hooks/useForm';
import FormContainer from '../components/FormContainer';
import SupportInfoPanel from '../components/SupportInfoPanel';

export default function CounselingForm() {
  const {
    formData,
    errors,
    currentStep,
    isSubmitting,
    updateField,
    updateArrayField,
    setErrors,
    setIsSubmitting,
  } = useForm();

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 lg:py-10">
      {/* Split-Screen Layout (Stacked on mobile/tablet, 2 Columns on Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start w-full">
        {/* Support & Information Panel (5 columns on desktop, below form on mobile) */}
        <div className="order-2 lg:order-1 lg:col-span-5 w-full">
          <div className="lg:sticky lg:top-8">
            <SupportInfoPanel />
          </div>
        </div>

        {/* 4-Step Intake Form (7 columns on desktop, top of screen on mobile) */}
        <div className="order-1 lg:order-2 lg:col-span-7 w-full">
          <FormContainer
            formData={formData}
            errors={errors}
            updateField={updateField}
            updateArrayField={updateArrayField}
            setErrors={setErrors}
            setIsSubmitting={setIsSubmitting}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}