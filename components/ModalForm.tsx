import React, { useState } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import { modalFormValidationSchema } from './ValidationSchema';
import ModalFormStep from './ModalFormSteps';

interface ModalFormProps {
  onClose: () => void;
}

export const ModalForm: React.FC<ModalFormProps> = ({ onClose }) => {
  const [step, setStep] = useState<number>(1);

  const initialValues = {
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

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onClose();
    }
  };

  const handleSubmit = (
    values: any,
    { setSubmitting }: FormikHelpers<any>
  ) => {
    console.log(values);
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <Formik
          initialValues={initialValues}
          validationSchema={modalFormValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, isSubmitting }) => (
            <Form>
              <ModalFormStep 
                step={step} 
                values={values} 
                errors={errors} 
                touched={touched} 
              />
              <div className="flex justify-between mt-4">
                <button 
                  type="button" 
                  onClick={handlePrevious} 
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                >
                  Previous
                </button>
                {step < 6 ? (
                  <button 
                    type="button" 
                    onClick={() => setStep(step + 1)} 
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Next
                  </button>
                ) : (
                  <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Submit
                  </button>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
