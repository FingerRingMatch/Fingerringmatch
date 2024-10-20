'use client';
import React, { useState} from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers, FormikTouched, FormikErrors } from 'formik';
import * as Yup from 'yup';
import { Transition } from '@headlessui/react';
import Image from 'next/image';
import SignUp from './Signup';
import { useFormContext } from '@/context/formContext';


interface FormValues {
  city: string;
  liveWithFamily: 'yes' | 'no' | '';
  familyCity?: string;
  maritalStatus: string;
  diet: string;
  height: string;
  subCommunity: string;
  qualification: string;
  collegeName: string;
  jobType: string;
  role: string;
  company: string;
  incomeRange: string;
  bio: string;
  profilePic: File | null;
}

const validationSchema = Yup.object({
  city: Yup.string().required('City is required'),
  liveWithFamily: Yup.string().oneOf(['yes', 'no'], 'Please select an option').required('Please select an option'),
  familyCity: Yup.string().when('liveWithFamily', {
    is: 'no',
    then: (schema) => schema.required('Family city is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  maritalStatus: Yup.string().required('Marital status is required'),
  diet: Yup.string().required('Diet preference is required'),
  height: Yup.number().required('Height is required').positive(),
  subCommunity: Yup.string().required('Sub-community is required'),
  qualification: Yup.string().required('Highest qualification is required'),
  collegeName: Yup.string().required('College name is required'),
  jobType: Yup.string().required('Job type is required'),
  role: Yup.string().required('Role is required'),
  company: Yup.string().required('Company is required'),
  incomeRange: Yup.string().required('Income range is required'),
  bio: Yup.string().required('Bio is required'),
  profilePic: Yup.mixed().required('Profile picture is required'),
});

const CreateProfile: React.FC = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const {formData, setFormData} = useFormContext()

  // Initial values
  const initialValues: FormValues = {
    city: formData.city,
    liveWithFamily: formData.liveWithFamily,
    familyCity: formData.familyCity,
    maritalStatus: formData.maritalStatus,
    diet: formData.diet,
    height: formData.height,
    subCommunity: formData.subCommunity,
    qualification: formData.qualification,
    collegeName: formData.collegeName,
    jobType: formData.jobType,
    role: formData.role,
    company: formData.company,
    incomeRange: formData.incomeRange,
    bio: formData.bio,
    profilePic: formData.profilePic,
  };

  const saveToContext = (values: FormValues) => {
    setFormData((prevData) => ({ ...prevData, ...values }));
  };

  const handleSubmit = (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
    saveToContext(values);
    console.log(formData);
    setSubmitting(false);
    setShowSignUpModal(true);

   
  };

  const nextStep = (values: FormValues, helpers: { setTouched: (touched: FormikTouched<FormValues>) => void; setErrors: (errors: FormikErrors<FormValues>) => void }) => {
    const errors = validateStep(step, values);

    if (Object.keys(errors).length === 0) {
      if (step < totalSteps) {
        setStep(step + 1);
      }
    } else {
      // Mark all fields as touched
      const touched: FormikTouched<FormValues> = Object.keys(values).reduce((acc, key) => {
        acc[key as keyof FormValues] = true;
        return acc;
      }, {} as FormikTouched<FormValues>);

      helpers.setTouched(touched);
      helpers.setErrors(errors);
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const validateStep = (currentStep: number, values: FormValues) => {
    const errors: FormikErrors<FormValues> = {};
    switch (currentStep) {
      case 1:
        if (!values.city) errors.city = 'City is required';
        if (!values.liveWithFamily) errors.liveWithFamily = 'Please select an option';
        if (values.liveWithFamily === 'no' && !values.familyCity) errors.familyCity = 'Family city is required';
        if (!values.maritalStatus) errors.maritalStatus = 'Marital status is required';
        if (!values.diet) errors.diet = 'Diet preference is required';
        if (!values.height) errors.height = 'Height is required';
        if (!values.subCommunity) errors.subCommunity = 'Sub-community is required';
        break;
      case 2:
        if (!values.qualification) errors.qualification = 'Highest qualification is required';
        if (!values.collegeName) errors.collegeName = 'College name is required';
        if (!values.jobType) errors.jobType = 'Job type is required';
        if (!values.role) errors.role = 'Role is required';
        if (!values.company) errors.company = 'Company is required';
        if (!values.incomeRange) errors.incomeRange = 'Income range is required';
        break;
      case 3:
        if (!values.bio) errors.bio = 'Bio is required';
        break;
      case 4:
        if (!values.profilePic) errors.profilePic = 'Profile picture is required';
        break;
    }
    return errors;
  };

  const heightOptions = Array.from({ length: 60 }, (_, i) => i + 140).map((h) => `${Math.floor(h / 100)}.${h % 100}`);

  return (
    <div className="min-h-screen bg-primaryPink flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-8">
        <div className="flex justify-between mb-8">
          {[...Array(totalSteps)].map((_, i) => (
            <div key={i} className={`w-full h-1 rounded-lg ${step > i ? 'bg-primaryPink' : 'bg-gray-200'} mx-2`} />
          ))}
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize // Allows Formik to update initialValues when they change
        >
          {({ values, setFieldValue, setTouched, setErrors }) => (
            <Form className="space-y-6">
              {/* Step 1 */}
              <Transition
                show={step === 1}
                enter="transition ease-out duration-500"
                enterFrom="opacity-0 translate-x-full"
                enterTo="opacity-100 translate-x-0"
                leave="transition ease-in duration-500"
                leaveFrom="opacity-100 translate-x-0"
                leaveTo="opacity-0 -translate-x-full"
                as="div"
              >
                {step === 1 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Personal Details</h3>
                    <div className="mb-4">
                      <label className="block text-gray-600 mb-1">City you live in</label>
                      <Field name="city" className="input-field border rounded-md p-2 w-full" placeholder="Enter your city" />
                      <ErrorMessage name="city" component="span" className="text-red-500 text-sm" />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-600 mb-1">Live with family?</label>
                      <Field name="liveWithFamily" as="select" className="input-field border rounded-md p-2 w-full">
                        <option value="">Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </Field>
                      <ErrorMessage name="liveWithFamily" component="span" className="text-red-500 text-sm" />
                    </div>

                    {values.liveWithFamily === 'no' && (
                      <div className="mb-4">
                        <label className="block text-gray-600 mb-1">Family City</label>
                        <Field name="familyCity" className="input-field border rounded-md p-2 w-full" placeholder="Enter your family's city" />
                        <ErrorMessage name="familyCity" component="span" className="text-red-500 text-sm" />
                      </div>
                    )}

                    <div className="mb-4">
                      <label className="block text-gray-600 mb-1">Marital Status</label>
                      <Field name="maritalStatus" as="select" className="input-field border rounded-md p-2 w-full">
                        <option value="">Select</option>
                        <option value="single">Single</option>
                        <option value="married">Married</option>
                        <option value="divorced">Divorced</option>
                        <option value="widowed">Widowed</option>
                      </Field>
                      <ErrorMessage name="maritalStatus" component="span" className="text-red-500 text-sm" />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-600 mb-1">Diet Preference</label>
                      <Field name="diet" as="select" className="input-field border rounded-md p-2 w-full">
                        <option value="">Select</option>
                        <option value="vegetarian">Vegetarian</option>
                        <option value="non-vegetarian">Non-Vegetarian</option>
                        <option value="vegan">Vegan</option>
                      </Field>
                      <ErrorMessage name="diet" component="span" className="text-red-500 text-sm" />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-600 mb-1">Height (cm)</label>
                      <Field as="select" name="height" className="input-field border rounded-md p-2 w-full">
                        <option value="">Select</option>
                        {heightOptions.map((h) => (
                          <option key={h} value={h}>{h} cm</option>
                        ))}
                      </Field>
                      <ErrorMessage name="height" component="span" className="text-red-500 text-sm" />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-600 mb-1">Sub-Community</label>
                      <Field name="subCommunity" className="input-field border rounded-md p-2 w-full" placeholder="Enter your sub-community" />
                      <ErrorMessage name="subCommunity" component="span" className="text-red-500 text-sm" />
                    </div>
                  </div>
                )}
              </Transition>

              {/* Step 2 */}
              <Transition
                show={step === 2}
                enter="transition ease-out duration-500"
                enterFrom="opacity-0 translate-x-full"
                enterTo="opacity-100 translate-x-0"
                leave="transition ease-in duration-500"
                leaveFrom="opacity-100 translate-x-0"
                leaveTo="opacity-0 -translate-x-full"
                as="div"
              >
                {step === 2 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Educational Details</h3>
                    <div className="mb-4">
                      <label className="block text-gray-600 mb-1">Highest Qualification</label>
                      <Field name="qualification" className="input-field border rounded-md p-2 w-full" placeholder="Enter your highest qualification" />
                      <ErrorMessage name="qualification" component="span" className="text-red-500 text-sm" />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-600 mb-1">College Name</label>
                      <Field name="collegeName" className="input-field border rounded-md p-2 w-full" placeholder="Enter your college name" />
                      <ErrorMessage name="collegeName" component="span" className="text-red-500 text-sm" />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-600 mb-1">Job Type</label>
                      <Field name="jobType" as="select" className="input-field border rounded-md p-2 w-full">
                        <option value="">Select</option>
                        <option value="full-time">Full-Time</option>
                        <option value="part-time">Part-Time</option>
                        <option value="internship">Internship</option>
                      </Field>
                      <ErrorMessage name="jobType" component="span" className="text-red-500 text-sm" />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-600 mb-1">Role</label>
                      <Field name="role" className="input-field border rounded-md p-2 w-full" placeholder="Enter your role" />
                      <ErrorMessage name="role" component="span" className="text-red-500 text-sm" />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-600 mb-1">Company</label>
                      <Field name="company" className="input-field border rounded-md p-2 w-full" placeholder="Enter your company name" />
                      <ErrorMessage name="company" component="span" className="text-red-500 text-sm" />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-600 mb-1">Income Range</label>
                      <Field name="incomeRange" as="select" className="input-field border rounded-md p-2 w-full">
                        <option value="">Select</option>
                        <option value="below-30k">Below 30k</option>
                        <option value="30k-50k">30k - 50k</option>
                        <option value="50k-70k">50k - 70k</option>
                        <option value="70k-100k">70k - 100k</option>
                        <option value="above-100k">Above 100k</option>
                      </Field>
                      <ErrorMessage name="incomeRange" component="span" className="text-red-500 text-sm" />
                    </div>
                  </div>
                )}
              </Transition>

              {/* Step 3 */}
              <Transition
                show={step === 3}
                enter="transition ease-out duration-500"
                enterFrom="opacity-0 translate-x-full"
                enterTo="opacity-100 translate-x-0"
                leave="transition ease-in duration-500"
                leaveFrom="opacity-100 translate-x-0"
                leaveTo="opacity-0 -translate-x-full"
                as="div"
              >
                {step === 3 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Additional Details</h3>
                    <div className="mb-4">
                      <label className="block text-gray-600 mb-1">Bio</label>
                      <Field as="textarea" name="bio" className="input-field border rounded-md p-2 w-full" placeholder="Tell us about yourself" />
                      <ErrorMessage name="bio" component="span" className="text-red-500 text-sm" />
                    </div>
                  </div>
                )}
              </Transition>

              {/* Step 4 */}
              <Transition
                show={step === 4}
                enter="transition ease-out duration-500"
                enterFrom="opacity-0 translate-x-full"
                enterTo="opacity-100 translate-x-0"
                leave="transition ease-in duration-500"
                leaveFrom="opacity-100 translate-x-0"
                leaveTo="opacity-0 -translate-x-full"
                as="div"
              >
                {step === 4 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Upload Profile Picture</h3>
                    <div className="mb-4">
                      <label className="block text-gray-600 mb-1">Profile Picture</label>
                      <input
                        type="file"
                        id="profilePic"
                        name="profilePic"
                        accept="image/*"
                        onChange={(event) => {
                          const files = event.currentTarget.files;
                          if (files && files.length > 0) {
                            const file = files[0];
                            if (file.size <= 5 * 1024 * 1024) {
                              setFieldValue('profilePic', file);
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setImagePreview(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            } else {
                              alert("File size should not exceed 5MB");
                            }
                          }
                        }}
                        className="input-field border border-gray-300 p-2 rounded-md w-full"
                      />
                      <ErrorMessage name="profilePic" component="span" className="text-red-500 text-sm" />
                      {imagePreview && (
                        <Image src={imagePreview} alt="Profile preview" width={100} height={100} className="mt-2 object-cover rounded-full justify-center" />
                      )}
                    </div>
                  </div>
                )}
              </Transition>

              <div className="flex justify-between mt-6">
                <button type="button" onClick={prevStep} disabled={step === 1} className="bg-gray-200 text-gray-600 px-4 py-2 rounded-md disabled:opacity-50">
                  Previous
                </button>
                {step < totalSteps ? (
                  <button type="button" onClick={() => nextStep(values, { setTouched, setErrors })} className="bg-primaryPink text-white px-4 py-2 rounded-md">
                    Next
                  </button>
                ) : (
                  <button type="submit" className="bg-primaryPink text-white px-4 py-2 rounded-md">
                    Submit
                  </button>
                )}
              </div>

            </Form>
          )}
        </Formik>
      </div>
      {showSignUpModal && <SignUp onClose={() => setShowSignUpModal(false)} />}
    </div>
  );
};

export default CreateProfile;
