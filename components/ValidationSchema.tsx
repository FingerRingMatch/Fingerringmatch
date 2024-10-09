import * as Yup from 'yup';

export const modalFormValidationSchema = Yup.object({
  relation: Yup.string().required('Required'),
  gender: Yup.string().required('Required'),
  name: Yup.string().required('Required'),
  dob: Yup.date().required('Required'),
  religion: Yup.string().required('Required'),
  language: Yup.string().required('Required'),
  country: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email address').required('Required'),
  phone: Yup.string().matches(/^[0-9]{10}$/, 'Phone number must be 10 digits').required('Required'),
});

export const overlayFormValidationSchema = Yup.object({
  gender: Yup.string(),
  ageFrom: Yup.number().min(18, 'Minimum age is 18'),
  ageTo: Yup.number().min(Yup.ref('ageFrom'), 'Age To must be greater than Age From'),
  religion: Yup.string(),
  language: Yup.string()
});