'use client'
import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction  } from "react";

interface UserFormData {
  gender: string;
  name: string;
  dob: string;
  religion: string;
  language: string;
  phone: string;
  email: string;
  city: string;
  liveWithFamily: 'yes' | 'no' | '',
  familyCity: string;
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

interface FormContextType {
  formData: UserFormData;
  setFormData: Dispatch<SetStateAction<UserFormData>>;
}

// Create context with proper type and a default value
const FormContext = createContext<FormContextType | null>(null);
interface FormProviderProps {
  children: ReactNode;
}




export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};

export const FormProvider: React.FC<FormProviderProps> = ({ children }) => {
  const [formData, setFormData] = useState<UserFormData>({
    gender: "",
    name: "",
    dob: "",
    religion: "",
    language: "",
    phone: "",
    email: "",
    city: "",
    liveWithFamily: "",
    familyCity: "",
    maritalStatus: "",
    diet: "",
    height: "",
    subCommunity: "",
    qualification: "",
    collegeName: "",
    jobType: "",
    role: "",
    company: "",
    incomeRange: "",
    bio: "",
    profilePic: null,
  });

  return (
    <FormContext.Provider value={{ formData, setFormData }}>
      {children}
    </FormContext.Provider>
  );
};
