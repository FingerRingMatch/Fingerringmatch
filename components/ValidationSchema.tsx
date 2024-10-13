import * as Yup from 'yup';

// Calculate the minimum date for 18 years ago
const today = new Date();
const eighteenYearsAgo = new Date(today.setFullYear(today.getFullYear() - 18));

export const modalFormValidationSchema = Yup.object({
  relation: Yup.string().required('Required'),
  gender: Yup.string().when('relation', {
    is: (relation: string) => relation !== 'son' && relation !== 'daughter',
    then: (schema) => schema.required('Required'),
    otherwise: (schema) => schema
  }),
  name: Yup.string().required('Required'),
  dob: Yup.date()
    .required('Required')
    .max(eighteenYearsAgo, 'Age must be at least 18 years old')  // Date must be before 18 years ago
    .test(
      'is-date-in-the-past',
      'Date cannot be in the future',
      (value) => value && value <= new Date()
    ),
  religion: Yup.string().required('Required'),
  language: Yup.string().required('Required'),
  country: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email address').required('Required'),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .required('Required'),
});

export const overlayFormValidationSchema = Yup.object({
  gender: Yup.string(),
  ageFrom: Yup.number().min(18, 'Minimum age is 18'),
  ageTo: Yup.number().min(Yup.ref('ageFrom'), 'Age To must be greater than Age From'),
  religion: Yup.string(),
  language: Yup.string()
});
