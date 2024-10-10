import React, { useState, useCallback } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import { ModalFormSteps } from './ModalFormSteps';
import { modalFormValidationSchema } from './ValidationSchema';

interface ModalFormProps {
  onClose: () => void;
  onSubmit: (values: ModalFormValues) => void;
}

interface ModalFormValues {
  relation: string;
  gender: string;
  name: string;
  dob: string;
  religion: string;
  language: string;
  country: string;
  email: string;
  phone: string;
}

export const ModalForm: React.FC<ModalFormProps> = ({ onClose, onSubmit }) => {
  const [step, setStep] = useState(0);

  const initialValues: ModalFormValues = {
    relation: '',
    gender: '',
    name: '',
    dob: '',
    religion: '',
    language: '',
    country: '',
    email: '',
    phone: '',
  };

  const handleSubmit = (
    values: ModalFormValues,
    { setSubmitting }: FormikHelpers<ModalFormValues>
  ) => {
    onSubmit(values);
    setSubmitting(false);
    onClose();
  };

  const getNextStep = useCallback(
    (currentStep: number, values: ModalFormValues) => {
      if (currentStep === 0 && (values.relation === 'son' || values.relation === 'daughter')) {
        return 2; // Skip gender step
      }
      return currentStep + 1;
    },
    []
  );

  const getPreviousStep = useCallback(
    (currentStep: number, values: ModalFormValues) => {
      if (currentStep === 2 && (values.relation === 'son' || values.relation === 'daughter')) {
        return 0; // Go back to relation step
      }
      return currentStep - 1;
    },
    []
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md sm:w-2/3 lg:w-1/3 max-h-[90vh] h-auto sm:h-80 overflow-y-auto">
        <Formik
          initialValues={initialValues}
          validationSchema={modalFormValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ isValid, errors, values }) => (
            <Form>
              <ModalFormSteps
                step={step}
                setStep={setStep}
                isValid={isValid}
                errors={errors}
                values={values}
                onClose={onClose}
                getNextStep={getNextStep}
                getPreviousStep={getPreviousStep}
              />
            </Form>
          )}
        </Formik>
      </div>
    </div>

  );
};
