import React from 'react';
import { relationOptions, religionOptions, languageOptions, countryOptions } from './formOptions';
import { Field, ErrorMessage, FormikErrors, FormikTouched } from 'formik';


export interface ModalFormValues {
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

interface ModalFormStepProps {
  step: number;
  values: ModalFormValues;
  errors: FormikErrors<ModalFormValues>;
  touched: FormikTouched<ModalFormValues>;
}

const ModalFormStep: React.FC<ModalFormStepProps> = ({ step, values}) => {
  const getDynamicLabel = (relation: string, gender: string, field: 'name' | 'dob'): string => {
    if (relation === 'self') {
      return `Your ${field === 'name' ? 'Name' : 'Date of Birth'}`;
    } else if (relation === 'son') {
      return `His ${field === 'name' ? 'Name' : 'Date of Birth'}`;
    } else if (relation === 'daughter') {
      return `Her ${field === 'name' ? 'Name' : 'Date of Birth'}`;
    } else if (['relative', 'friend'].includes(relation) && gender === 'male') {
      return `His ${field === 'name' ? 'Name' : 'Date of Birth'}`;
    } else if (['relative', 'friend'].includes(relation) && gender === 'female') {
      return `Her ${field === 'name' ? 'Name' : 'Date of Birth'}`;
    } else {
      return `${field === 'name' ? 'Name' : 'Date of Birth'}`;
    }
  };

  const FormSteps = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2 className="text-xl mb-4">👪 Your Relation</h2>
            <Field as="select" name="relation" className="w-full bg-white text-gray-500 p-2 rounded-lg border border-black">
              <option value="">Select relation</option>
              {relationOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Field>
            <ErrorMessage name="relation" component="div" className="text-red-500 text-sm mt-1" />
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-xl mb-4">⚧ Gender</h2>
            <Field as="select" name="gender" className="w-full bg-white text-gray-500 p-2 rounded-lg border border-black">
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Field>
            <ErrorMessage name="gender" component="div" className="text-red-500 text-sm mt-1" />
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-xl mb-4">{getDynamicLabel(values.relation, values.gender, 'name')}</h2>
            <Field name="name" placeholder="Name" className="w-full bg-white text-gray-500 p-2 rounded-lg mb-2 border border-black" />
            <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
            <h2 className="text-xl mb-4">{getDynamicLabel(values.relation, values.gender, 'dob')}</h2>
            <Field type="date" name="dob" className="w-full bg-white text-gray-500 p-2 rounded-lg border border-black" />
            <ErrorMessage name="dob" component="div" className="text-red-500 text-sm mt-1" />
          </div>
        );
      case 4:
        return (
          <div>
            <h2 className="text-xl mb-4">🛐 Religion and Language</h2>
            <Field as="select" name="religion" className="w-full bg-white text-gray-500 p-2 rounded-lg mb-2 border border-black">
              <option value="">Select religion</option>
              {religionOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Field>
            <ErrorMessage name="religion" component="div" className="text-red-500 text-sm mt-1" />
            <Field as="select" name="language" className="w-full bg-white text-gray-500 p-2 rounded-lg border border-black">
              <option value="">Select language</option>
              {languageOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Field>
            <ErrorMessage name="language" component="div" className="text-red-500 text-sm mt-1" />
          </div>
        );
      case 5:
        return (
          <div>
            <h2 className="text-xl mb-4">🌍 Living In Country</h2>
            <Field as="select" name="country" className="w-full bg-white text-gray-500 p-2 rounded-lg border border-black">
              <option value="">Select country</option>
              {countryOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Field>
            <ErrorMessage name="country" component="div" className="text-red-500 text-sm mt-1" />
          </div>
        );
      case 6:
        return (
          <div>
            <h2 className="text-xl mb-4">📧 Contact Information</h2>
            <Field name="email" type="email" placeholder="Email" className="w-full bg-white text-gray-500 p-2 rounded-lg mb-2 border border-black" />
            <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
            <Field name="phone" type="tel" placeholder="Phone" className="w-full bg-white text-gray-500 p-2 rounded-lg border border-black" />
            <ErrorMessage name="phone" component="div" className="text-red-500 text-sm mt-1" />
          </div>
        );
      default:
        return null;
    }
  };

  return <FormSteps />;
};

export default ModalFormStep;
