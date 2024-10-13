import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { relationOptions, religionOptions, languageOptions, countryOptions } from './formOptions';

interface Option {
  value: string;
  label: string;
}

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

interface ModalFormStepsProps {
  step: number;
  setStep: (step: number) => void;
  isValid: boolean;
  errors: Partial<Record<keyof FormValues, string>>;
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
  values,
  onClose,
  getNextStep,
  getPreviousStep,
}) => {
  const formSteps = [
    {
      title: '👪 Your Relation',
      fields: ['relation'], // Only relation in the first step.
    },
    {
      title: '👫 Gender',
      fields: ['gender'], // Gender step now directly after relation.
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
          <div className="space-y-2">
            <div className="flex flex-wrap space-x-4 justify-center"> {/* Adjust for wrapping on smaller screens */}
              {relationOptions.map((option: Option) => (
                <label
                  key={option.value}
                  className="flex items-center justify-center space-x-2 text-lg" // Bigger buttons
                >
                  <Field
                    type="radio"
                    name="relation"
                    value={option.value}
                    className="w-6 h-6 text-primaryPink focus:ring-primaryPink" // Larger size
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
            <ErrorMessage name="relation" component="div" className="text-red-500 text-sm mt-1" />
          </div>
        );
      case 'gender':
        return (
          <div className="space-y-2">
            <div className="flex flex-wrap space-x-4"> {/* Adjust for wrapping on smaller screens */}
              {['male', 'female', 'other'].map((gender: string) => (
                <label
                  key={gender}
                  className="flex items-center space-x-2 text-lg" // Bigger buttons
                >
                  <Field
                    type="radio"
                    name="gender"
                    value={gender}
                    className="w-6 h-6 text-primaryPink focus:ring-primaryPink" // Larger size
                  />
                  <span>{gender.charAt(0).toUpperCase() + gender.slice(1)}</span>
                </label>
              ))}
            </div>
            <ErrorMessage name="gender" component="div" className="text-red-500 text-sm mt-1" />
          </div>
        );
      case 'name':
        return (
          <div>
          <Field
            name="name"
            placeholder="Name"
            className="w-full bg-white text-gray-700 border border-gray-300 rounded-md py-2 px-3 outline-none focus:ring-2 focus:ring-primaryPink"
          />
          <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
          </div>
        );
      case 'dob':
        return (
          <div>
          <Field
            type="date"
            name="dob"
            className="w-full bg-white text-gray-700 border border-gray-300 rounded-md py-2 px-3 outline-none focus:ring-2 focus:ring-primaryPink"
          />
          <ErrorMessage name="dob" component="div" className="text-red-500 text-sm mt-1" />
          </div>
        );
      case 'religion':
        return (
          <Field
            as="select"
            name="religion"
            className="w-full bg-white text-gray-700 border border-gray-300 rounded-md py-2 px-3 outline-none focus:ring-2 focus:ring-primaryPink"
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
            className="w-full bg-white text-gray-700 border border-gray-300 rounded-md py-2 px-3 outline-none focus:ring-2 focus:ring-primaryPink"
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
            className="w-full bg-white text-gray-700 border border-gray-300 rounded-md py-2 px-3 outline-none focus:ring-2 focus:ring-primaryPink"
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
            className="w-full bg-white text-gray-700 border border-gray-300 rounded-md py-2 px-3 outline-none focus:ring-2 focus:ring-primaryPink"
          />
        );
      case 'phone':
        return (
          <Field
            type="tel"
            name="phone"
            placeholder="Phone"
            className="w-full bg-white text-gray-700 border border-gray-300 rounded-md py-2 px-3 outline-none focus:ring-2 focus:ring-primaryPink"
          />
        );
      default:
        return null;
    }
  };
  const isStepValid = currentStep.fields.every(
    field => !errors[field as keyof FormValues] && values[field as keyof FormValues]
  );

  return (
    <div className="flex flex-col h-full">
    <h2 className="text-xl text-center font-bold mb-4">{currentStep.title}</h2>

    <div className={`flex-grow transition-transform duration-500 ease-in-out`}>
      {currentStep.fields.map((field) => (
        <div key={field} className="mb-4">
          {renderField(field as keyof FormValues)}
        </div>
      ))}
    </div>

    {/* Button container */}
    <div className="flex justify-between mt-4 mb-2">
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
            if (isStepValid) {
              setStep(getNextStep(step, values));
            }
          }}
          className={`px-4 py-2 rounded transition-colors ${
            isStepValid
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
