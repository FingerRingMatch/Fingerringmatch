'use client';
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import { overlayFormValidationSchema } from './ValidationSchema';
import { religionOptions, languageOptions } from './formOptions';
import { HeartSVG } from './HeartSVG';
import { ModalForm } from './ModalForm';

// Define the form's initial values and the shape of form data
interface FormValues {
  gender: string;
  ageFrom: number | '';
  ageTo: number | '';
  religion: string;
  language: string;
}

function OverlayForm() {
  const [showModal, setShowModal] = useState(false);

  const initialValues: FormValues = {
    gender: '',
    ageFrom: '',
    ageTo: '',
    religion: '',
    language: ''
  };

  const handleSubmit = (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
    console.log(values);
    setSubmitting(false);
    setShowModal(true);
  };

  return (
    <div>
      <div className="absolute bottom-10 left-0 right-0 mx-4 sm:mx-10 md:mx-20 lg:mx-40 bg-black bg-opacity-50 p-6 shadow-lg text-white rounded-tl-xl rounded-tr-xl">
        <Formik
          initialValues={initialValues}
          validationSchema={overlayFormValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="gender">Looking for</label>
                <Field as="select" name="gender" className="w-full bg-white text-gray-500 p-2 rounded-lg outline-none">
                  <option value="" label="Select gender" />
                  <option value="woman" label="Woman" />
                  <option value="man" label="Man" />
                </Field>
                <ErrorMessage name="gender" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="ageRange">Age Range</label>
                <div className="flex flex-col sm:flex-row space-x-0 gap-2 sm:space-x-2">
                  <Field type="number" name="ageFrom" placeholder="From" className="w-full bg-white text-gray-500 p-2 rounded-lg outline-none" min={18} />
                  <Field type="number" name="ageTo" placeholder="To" className="w-full bg-white text-gray-500 p-2 rounded-lg outline-none" />
                </div>
                <ErrorMessage name="ageFrom" component="div" className="text-red-500 text-sm mt-1" />
                <ErrorMessage name="ageTo" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="religion">Religion</label>
                <Field as="select" name="religion" className="w-full bg-white text-gray-500 p-2 rounded-lg mb-2 border border-black">
                  <option value="">Select religion</option>
                  {religionOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="religion" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="language">Mother Tongue</label>
                <Field as="select" name="language" className="w-full bg-white text-gray-500 p-2 rounded-lg mb-2 border border-black">
                  <option value="">Select language</option>
                  {languageOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="language" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div className="col-span-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center bg-primaryPink hover:bg-primaryGreen transition-all duration-300 p-2 rounded-full"
                  disabled={isSubmitting}
                >
                  Let&apos;s Begin
                  <span className="inline-block ml-2 w-6 h-6">
                    <HeartSVG />
                  </span>
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      {showModal && <ModalForm onClose={() => setShowModal(false)} />}
    </div>
  );
}

export default OverlayForm;
