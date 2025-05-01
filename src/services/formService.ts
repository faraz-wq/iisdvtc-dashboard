import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/forms`; // Replace with your API endpoint

// Define the Form Submission interface
export interface FormSubmission {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject?: string;
  program?: string;
  bestTime?: "morning" | "afternoon" | "evening";
  message?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>; // Dynamic metadata for additional fields
  createdAt: string; // Timestamp
  updatedAt: string; // Timestamp
}

// CRUD Operations for Form Submissions

// Fetch all form submissions
export const getFormSubmissions = async (): Promise<FormSubmission[]> => {
  try {
    const response = await axios.get(API_URL, {
      withCredentials: true,
    });
    console.log(response.data);
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch form submissions');
  }
};

// Fetch a single form submission by ID
export const getFormSubmission = async (id: string): Promise<FormSubmission> => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      withCredentials: true,
    });
    console.log(response.data);
    return (response.data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch form submission');
  }
};

// Create a new form submission
export const createFormSubmission = async (formData: Omit<FormSubmission, '_id'>): Promise<FormSubmission> => {
  try {
    const response = await axios.post(API_URL, formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to create form submission');
  }
};

// Update an existing form submission by ID
export const updateFormSubmission = async (
  id: string,
  formData: Partial<FormSubmission>
): Promise<FormSubmission> => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to update form submission');
  }
};

// Delete a form submission by ID
export const deleteFormSubmission = async (id: string): Promise<{ message: string }> => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to delete form submission');
  }
};

// Helper function to clean form submission data
function cleanFormSubmissionData(data): FormSubmission {
  const cleanedData = { ...data };

  // Ensure optional fields have default values if missing
  cleanedData.subject = cleanedData.subject || '';
  cleanedData.program = cleanedData.program || '';
  cleanedData.bestTime = cleanedData.bestTime || null;
  cleanedData.message = cleanedData.message || '';

  // Parse metadata if it's a string
  if (typeof cleanedData.metadata === 'string') {
    try {
      cleanedData.metadata = JSON.parse(cleanedData.metadata);
    } catch (error) {
      console.error("Failed to parse 'metadata' field:", error);
      cleanedData.metadata = {};
    }
  }

  // Remove unnecessary fields like '__v'
  delete cleanedData.__v;

  return cleanedData as FormSubmission;
}