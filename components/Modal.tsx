import React, { useState, useCallback, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import { modalFormValidationSchema } from './ValidationSchema';
import { Transition } from '@headlessui/react';
import { religionOptions, languageOptions, countryOptions, relationOptions } from './formOptions';
import { useRouter } from 'next/navigation';

interface ModalFormProps {
    onClose: () => void;
    onSubmit: (values: ModalFormValues) => void;
}

interface Option {
    value: string;
    label: string;
}

interface ModalFormValues {
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

export const ModalForm: React.FC<ModalFormProps> = ({ onClose, onSubmit }) => {
    const [step, setStep] = useState(1);
    const totalSteps = 6;
    const router = useRouter();

    const [initialValues, setInitialValues] = useState<ModalFormValues>({
        relation: '',
        gender: '',
        name: '',
        dob: '',
        religion: '',
        language: '',
        country: '',
        email: '',
        phone: '',
    });

    useEffect(() => {
        const storedValues = localStorage.getItem('modalFormValues');
        if (storedValues) {
            setInitialValues(JSON.parse(storedValues));
        }
    }, []);

    const handleSubmit = (
        values: ModalFormValues,
        { setSubmitting }: FormikHelpers<ModalFormValues>
    ) => {
        localStorage.setItem('modalFormValues', JSON.stringify(values));
        onSubmit(values);
        setSubmitting(false);
        router.push('/create-profile');
    };

    const isValidEmail = (email: string) => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return emailRegex.test(email);
    };
    
    const isValidPhoneNumber = (phone: string) => {
        const phoneRegex = /^[0-9]{10}$/;
        return phoneRegex.test(phone);
    };
    
    const calculateAge = (birthday: string): number => {
        const ageDifMs = Date.now() - new Date(birthday).getTime();
        const ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    const validateStep = (currentStep: number, values: ModalFormValues) => {
        const errors: { [key: string]: string } = {};
        switch (currentStep) {
            case 1:
                if (!values.relation) errors.relation = 'Relation is required';
                break;
            case 2:
                if (!values.gender) errors.gender = 'Gender is required';
                break;
                case 3:
                    if (!values.name) errors.name = 'Name is required';
                    if (!values.dob) {
                        errors.dob = 'Date of birth is required';
                    } else {
                        const age = calculateAge(values.dob);
                        if (age < 18) {
                            errors.dob = 'You must be at least 18 years old';
                        }
                    }
                    break;
            case 4:
                if (!values.religion) errors.religion = 'Religion is required';
                if (!values.language) errors.language = 'Language is required';
                break;
            case 5:
                if (!values.country) errors.country = 'Country is required';
                break;
                case 6:
                    if (!values.email) {
                        errors.email = 'Email is required';
                    } else if (!isValidEmail(values.email)) {
                        errors.email = 'Invalid email address';
                    }
                    if (!values.phone) {
                        errors.phone = 'Phone number is required';
                    } else if (!isValidPhoneNumber(values.phone)) {
                        errors.phone = 'Phone number must be 10 digits';
                    }
                    break;
        }
        return errors;
    };

    const getNextStep = useCallback(
        (currentStep: number, values: ModalFormValues) => {
            if (currentStep === 1) {
                if (values.relation === 'son') {
                    values.gender = 'male';
                } else if (values.relation === 'daughter') {
                    values.gender = 'female';
                }
            }

            if (currentStep === 1 && (values.relation === 'son' || values.relation === 'daughter')) {
                return 3;
            }
            return currentStep + 1;
        },
        []
    );

    const getPreviousStep = useCallback(
        (currentStep: number, values: ModalFormValues) => {
            if (currentStep === 3 && (values.relation === 'son' || values.relation === 'daughter')) {
                return 1;
            }
            return currentStep - 1;
        },
        []
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-4/5 max-w-xl lg:w-1/2 max-h-[90vh] h-96 flex flex-col overflow-hidden transition-all duration-500 overflow-y-auto">
                <div className="flex justify-between mb-8">
                    {[...Array(totalSteps)].map((_, i) => (
                        <div key={i} className={`w-full h-1 rounded-lg ${step > i ? 'bg-primaryPink' : 'bg-gray-200'} mx-2`} />
                    ))}
                </div>

                <Formik
                    initialValues={initialValues}
                    validationSchema={modalFormValidationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {({ isValid, values, setTouched, setErrors }) => (
                        <Form className="flex flex-col h-full">
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
                           <h3 className="text-xl font-semibold mb-4">Your Relation</h3>
                           <div className="space-y-2">
                             <div className="flex flex-col sm:flex-row flex-wrap items-start sm:space-x-4 space-y-2 sm:space-y-0 justify-center">
                               {relationOptions.map((option: Option) => (
                                 <label
                                   key={option.value}
                                   className="flex items-center justify-center space-x-2 text-lg"
                                 >
                                   <Field
                                     type="radio"
                                     name="relation"
                                     value={option.value}
                                     className="w-4 h-4 text-primaryPink focus:ring-primaryPink"
                                   />
                                   <span>{option.label}</span>
                                 </label>
                               ))}
                             </div>
                             <ErrorMessage name="relation" component="div" className="text-red-500 text-sm mt-1" />
                           </div>
                         </div>
                         
                        )}
                    </Transition>

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
                                        <h3 className="text-xl font-semibold mb-4">Gender</h3>
                                        <div className="space-y-2">
                                            <div className="flex flex-wrap space-x-4">
                                                {['male', 'female', 'other'].map((gender) => (
                                                    <label key={gender} className="flex items-center space-x-2 text-lg">
                                                        <Field
                                                            type="radio"
                                                            name="gender"
                                                            value={gender}
                                                            className="w-4 h-4 text-primaryPink focus:ring-primaryPink"
                                                        />
                                                        <span>{gender.charAt(0).toUpperCase() + gender.slice(1)}</span>
                                                    </label>
                                                ))}
                                            </div>
                                            <ErrorMessage name="gender" component="div" className="text-red-500 text-sm mt-1" />
                                        </div>
                                    </div>
                                )}
                            </Transition>

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
                                        <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <Field
                                                    name="name"
                                                    placeholder="Name"
                                                    className="w-full bg-white text-gray-700 border border-gray-300 rounded-md py-2 px-3 outline-none focus:ring-2 focus:ring-primaryPink"
                                                />
                                                <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                                            </div>
                                            <div>
                                                <Field
                                                    type="date"
                                                    name="dob"
                                                    className="w-full bg-white text-gray-700 border border-gray-300 rounded-md py-2 px-3 outline-none focus:ring-2 focus:ring-primaryPink"
                                                />
                                                <ErrorMessage name="dob" component="div" className="text-red-500 text-sm mt-1" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Transition>

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
                                        <h3 className="text-xl font-semibold mb-4">Religion and Language</h3>
                                        <div className="space-y-4">
                                            <div>
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
                                                <ErrorMessage name="religion" component="div" className="text-red-500 text-sm mt-1" />
                                            </div>
                                            <div>
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
                                                <ErrorMessage name="language" component="div" className="text-red-500 text-sm mt-1" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Transition>

                            <Transition
                                show={step === 5}
                                enter="transition ease-out duration-500"
                                enterFrom="opacity-0 translate-x-full"
                                enterTo="opacity-100 translate-x-0"
                                leave="transition ease-in duration-500"
                                leaveFrom="opacity-100 translate-x-0"
                                leaveTo="opacity-0 -translate-x-full"
                                as="div"
                            >
                                {step === 5 && (
                                    <div>
                                        <h3 className="text-xl font-semibold mb-4">Living In Country</h3>
                                        <div>
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
                                            <ErrorMessage name="country" component="div" className="text-red-500 text-sm mt-1" />
                                        </div>
                                    </div>
                                )}
                            </Transition>

                            <Transition
                                show={step === 6}
                                enter="transition ease-out duration-500"
                                enterFrom="opacity-0 translate-x-full"
                                enterTo="opacity-100 translate-x-0"
                                leave="transition ease-in duration-500"
                                leaveFrom="opacity-100 translate-x-0"
                                leaveTo="opacity-0 -translate-x-full"
                                as="div"
                            >
                                {step === 6 && (
                                    <div>
                                        <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <Field
                                                    type="email"
                                                    name="email"
                                                    placeholder="Email"
                                                    className="w-full bg-white text-gray-700 border border-gray-300 rounded-md py-2 px-3 outline-none focus:ring-2 focus:ring-primaryPink"
                                                />
                                                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                                            </div>
                                            <div>
                                                <Field
                                                    type="tel"
                                                    name="phone"
                                                    placeholder="Phone"
                                                    className="w-full bg-white text-gray-700 border border-gray-300 rounded-md py-2 px-3 outline-none focus:ring-2 focus:ring-primaryPink"
                                                />
                                                <ErrorMessage name="phone" component="div" className="text-red-500 text-sm mt-1" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Transition>

                            <div className="mt-auto flex justify-between pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (step > 1) {
                                            setStep(getPreviousStep(step, values));
                                        } else {
                                            onClose();
                                        }
                                        localStorage.setItem('modalFormValues', JSON.stringify(values));
                                    }}
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
                                >
                                    {step > 1 ? 'Previous' : 'Cancel'}
                                </button>

                                {step < totalSteps ? (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const stepErrors = validateStep(step, values);
                                            if (Object.keys(stepErrors).length === 0) {
                                                const nextStepNumber = getNextStep(step, values);
                                                if (nextStepNumber <= totalSteps) {
                                                    setStep(nextStepNumber);
                                                    localStorage.setItem('modalFormValues', JSON.stringify(values));
                                                }
                                            } else {
                                                setTouched(stepErrors);
                                                setErrors(stepErrors);
                                            }
                                        }}
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
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
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};