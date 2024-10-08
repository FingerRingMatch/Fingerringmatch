'use client'
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function OverlayForm() {
  const HeartSVG = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
    </svg>
  );

  const initialValues = {
    gender: '',
    ageFrom: '',
    ageTo: '',
    religion: '',
    language: ''
  };

  const validationSchema = Yup.object({
    gender: Yup.string().required('Required'),
    ageFrom: Yup.number().min(18, 'Minimum age is 18').required('Required'),
    ageTo: Yup.number().min(Yup.ref('ageFrom'), 'Age To must be greater than Age From').required('Required'),
    religion: Yup.string().required('Required'),
    language: Yup.string().required('Required')
  });

  const handleSubmit = (values) => {
    console.log(values);
  };

  return (
    <div>
      <div className="absolute bottom-10 left-0 right-0 mx-40 bg-black bg-opacity-50 p-6 shadow-lg text-white rounded-tl-xl rounded-tr-xl">
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form className="max-w-4xl mx-auto grid grid-cols-2 gap-4">
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
                <div className="flex space-x-2">
                  <Field type="number" name="ageFrom" placeholder="From" className="w-full bg-white text-gray-500 p-1 rounded-lg outline-none" min={18} />
                  <Field type="number" name="ageTo" placeholder="To" className="w-full bg-white text-gray-500 p-1 rounded-lg outline-none" />
                </div>
                <ErrorMessage name="ageFrom" component="div" className="text-red-500 text-sm mt-1" />
                <ErrorMessage name="ageTo" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="religion">Religion</label>
                <Field as="select" name="religion" className="w-full bg-white text-gray-500 p-2 rounded-lg">
                  <option value="" label="Select religion" />
                  <option value="christian" label="Christian" />
                  <option value="hindu" label="Hindu" />
                  <option value="muslim" label="Muslim" />
                </Field>
                <ErrorMessage name="religion" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="language">Mother Tongue</label>
                <Field as="select" name="language" className="w-full bg-white text-gray-500 p-2 rounded-lg">
                  <option value="" label="Select language" />
                  <option value="english" label="English" />
                  <option value="hindi" label="Hindi" />
                  <option value="tamil" label="Tamil" />
                  <option value="malayalam" label="Malayalam" />
                  <option value="marathi" label="Marathi" />
                </Field>
                <ErrorMessage name="language" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div className="col-span-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center bg-primaryPink hover:bg-primaryGreen transition-all duration-300 p-1 rounded-full"
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
    </div>
  );
}

export default OverlayForm;
