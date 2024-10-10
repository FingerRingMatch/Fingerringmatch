import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { relationOptions, religionOptions, languageOptions, countryOptions } from './formOptions';

// Define types for form options
interface Option {
  value: string;
  label: string;
}

// Define the structure of the form values
interface FormValues {
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

// Define the props for the ModalFormSteps component
interface ModalFormStepsProps {
  step: number;
  setStep: (step: number) => void;
  isValid: boolean;
  errors: Partial<Record<keyof FormValues, string>>;
  touched: Partial<Record<keyof FormValues, boolean>>;
  values: FormValues;
  onClose: () => void;
  getNextStep: (currentStep: number, values: FormValues) => number;
  getPreviousStep: (currentStep: number, values: FormValues) => number;
}

export const ModalFormSteps: React.FC<ModalFormStepsProps> = ({
  step,
  setStep,
  isValid,
  errors,
  touched,
  values,
  onClose,
  getNextStep,
  getPreviousStep,
}) => {
  const formSteps = [
    {
      title: '👪 Your Relation',
      fields: ['relation'],
    },
    {
      title: '⚧ Gender',
      fields: ['gender'],
    },
    {
      title: '📝 Personal Information',
      fields: ['name', 'dob'],
    },
    {
      title: '🛐 Religion and Language',
      fields: ['religion', 'language'],
    },
    {
      title: '🌍 Living In Country',
      fields: ['country'],
    },
    {
      title: '📧 Contact Information',
      fields: ['email', 'phone'],
    },
  ];

  const currentStep = formSteps[step];

  const renderField = (field: keyof FormValues) => {
    switch (field) {
      case 'relation':
        return (
          <Field
            as="select"
            name="relation"
            className="w-full bg-white text-gray-700 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select relation</option>
            {relationOptions.map((option: Option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Field>
        );
      case 'gender':
        return (
          <Field
            as="select"
            name="gender"
            className="w-full bg-white text-gray-700 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </Field>
        );
      case 'name':
        return (
          <Field
            name="name"
            placeholder="Name"
            className="w-full bg-white text-gray-700 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
      case 'dob':
        return (
          <Field
            type="date"
            name="dob"
            className="w-full bg-white text-gray-700 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
      case 'religion':
        return (
          <Field
            as="select"
            name="religion"
            className="w-full bg-white text-gray-700 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select religion</option>
            {religionOptions.map((option: Option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Field>
        );
      case 'language':
        return (
          <Field
            as="select"
            name="language"
            className="w-full bg-white text-gray-700 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select language</option>
            {languageOptions.map((option: Option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Field>
        );
      case 'country':
        return (
          <Field
            as="select"
            name="country"
            className="w-full bg-white text-gray-700 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select country</option>
            {countryOptions.map((option: Option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Field>
        );
      case 'email':
        return (
          <Field
            type="email"
            name="email"
            placeholder="Email"
            className="w-full bg-white text-gray-700 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
      case 'phone':
        return (
          <Field
            type="tel"
            name="phone"
            placeholder="Phone"
            className="w-full bg-white text-gray-700 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full"> {/* Added flexbox */}
    <h2 className="text-xl text-center font-bold mb-4">{currentStep.title}</h2>

    <div className="flex-grow"> {/* Allows form fields to grow */}
      {currentStep.fields.map((field) => (
        <div key={field} className="mb-4">
          {renderField(field as keyof FormValues)}
          <ErrorMessage name={field} component="div" className="text-red-500 text-sm mt-1" />
        </div>
      ))}
    </div>

    <div className="flex justify-between mt-4"> {/* Buttons positioned at the bottom */}
      <button
        type="button"
        onClick={() => {
          if (step > 0) {
            setStep(getPreviousStep(step, values));
          } else {
            onClose();
          }
        }}
        className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
      >
        {step > 0 ? 'Previous' : 'Cancel'}
      </button>
      
      {step < formSteps.length - 1 ? (
        <button
          type="button"
          onClick={() => {
            const stepFields = currentStep.fields;
            const stepIsValid = stepFields.every(
              field => !errors[field as keyof FormValues] 
            );
            if (stepIsValid) {
              if (values.relation === 'son') {
                values.gender = 'male';
              } else if (values.relation === 'daughter') {
                values.gender = 'female';
              }
              setStep(getNextStep(step, values));
            }
          }}
          className={`px-4 py-2 rounded transition-colors ${
            currentStep.fields.every(
              field => !errors[field as keyof FormValues]
            )
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Next
        </button>
      ) : (
        <button
          type="submit"
          disabled={!isValid}
          className={`px-4 py-2 rounded transition-colors ${
            isValid
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Submit
        </button>
      )}
    </div>
  </div>
  );
};
