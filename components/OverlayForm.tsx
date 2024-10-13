'use client';
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import { overlayFormValidationSchema } from './ValidationSchema';
import { religionOptions, languageOptions } from './formOptions';
import { HeartSVG } from './HeartSVG';
import { ModalForm } from './Modal';

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
  <div className="absolute bottom-10 left-0 right-0 mx-auto max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl bg-black bg-opacity-50 p-4 sm:p-6 shadow-lg text-white rounded-t-xl">
    <Formik
      initialValues={initialValues}
      validationSchema={overlayFormValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Looking for */}
          <div className="w-full">
            <label className="block text-xs sm:text-sm font-medium mb-1" htmlFor="gender">Looking for</label>
            <Field
              as="select"
              name="gender"
              className="w-full bg-white text-gray-600 p-2 sm:p-3 rounded-lg shadow-sm outline-none focus:ring-2 focus:ring-primaryPink text-xs sm:text-sm"
            >
              <option value="" label="Select gender" />
              <option value="woman" label="Woman" />
              <option value="man" label="Man" />
            </Field>
            <ErrorMessage name="gender" component="div" className="text-red-500 text-xs sm:text-sm mt-1" />
          </div>

          {/* Age Range */}
          <div className="w-full">
            <label className="block text-xs sm:text-sm font-medium mb-1" htmlFor="ageRange">Age Range</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Field
                type="number"
                name="ageFrom"
                placeholder="From"
                className="w-full bg-white text-gray-600 p-2 sm:p-3 rounded-lg shadow-sm outline-none focus:ring-2 focus:ring-primaryPink text-xs sm:text-sm"
                min={18}
              />
              <Field
                type="number"
                name="ageTo"
                placeholder="To"
                className="w-full bg-white text-gray-600 p-2 sm:p-3 rounded-lg shadow-sm outline-none focus:ring-2 focus:ring-primaryPink text-xs sm:text-sm"
              />
            </div>
            <ErrorMessage name="ageFrom" component="div" className="text-red-500 text-xs sm:text-sm mt-1" />
            <ErrorMessage name="ageTo" component="div" className="text-red-500 text-xs sm:text-sm mt-1" />
          </div>

          {/* Religion */}
          <div className="w-full">
            <label className="block text-xs sm:text-sm font-medium mb-1" htmlFor="religion">Religion</label>
            <Field
              as="select"
              name="religion"
              className="w-full bg-white text-gray-600 p-2 sm:p-3 rounded-lg shadow-sm outline-none focus:ring-2 focus:ring-primaryPink text-xs sm:text-sm border border-gray-300"
            >
              <option value="">Select religion</option>
              {religionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Field>
            <ErrorMessage name="religion" component="div" className="text-red-500 text-xs sm:text-sm mt-1" />
          </div>

          {/* Mother Tongue */}
          <div className="w-full">
            <label className="block text-xs sm:text-sm font-medium mb-1" htmlFor="language">Mother Tongue</label>
            <Field
              as="select"
              name="language"
              className="w-full bg-white text-gray-600 p-2 sm:p-3 rounded-lg shadow-sm outline-none focus:ring-2 focus:ring-primaryPink text-xs sm:text-sm border border-gray-300"
            >
              <option value="">Select language</option>
              {languageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Field>
            <ErrorMessage name="language" component="div" className="text-red-500 text-xs sm:text-sm mt-1" />
          </div>

          {/* Submit Button */}
          <div className="col-span-1 sm:col-span-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center bg-primaryPink hover:bg-opacity-50 transition-all duration-300 p-2 sm:p-3 rounded-full shadow-md focus:ring-2 focus:ring-primaryGreen"
              disabled={isSubmitting}
            >
              Let&apos;s Begin
              <span className="inline-block ml-2 w-5 h-5 sm:w-6 sm:h-6">
                <HeartSVG />
              </span>
            </button>
          </div>
        </Form>
      )}
    </Formik>
  </div>
      {showModal && <ModalForm onClose={() => setShowModal(false)} onSubmit={(values) => console.log('Modal submitted:', values)} />}
    </div>


  );
}

export default OverlayForm;
