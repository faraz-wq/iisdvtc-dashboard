import axios from 'axios';

const API_URL = 'http://localhost:3000/inquiries'; // Replace with your API endpoint

// Define the Inquiry interface
export interface Inquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  college: string; // Reference to a college ID or name
  program: string; // Reference to a program ID or name
  inquiry: string; // The user's inquiry message
  createdAt: string; // Timestamp
  updatedAt: string; // Timestamp
}

// CRUD Operations for Inquiries

// Fetch all inquiries
export const getInquiries = async (): Promise<Inquiry[]> => {
  try {
    const response = await axios.get(API_URL, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch inquiries');
  }
};

// Fetch a single inquiry by ID
export const getInquiry = async (id: string): Promise<Inquiry> => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      withCredentials: true,
    });
    return cleanInquiryData(response.data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch inquiry');
  }
};

// Create a new inquiry
export const createInquiry = async (inquiryData: Omit<Inquiry, '_id'>): Promise<Inquiry> => {
  try {
    const response = await axios.post(API_URL, inquiryData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to create inquiry');
  }
};

// Delete an inquiry by ID
export const deleteInquiry = async (id: string): Promise<{ message: string }> => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to delete inquiry');
  }
};

// Helper function to clean inquiry data
function cleanInquiryData(data): Inquiry {
  const cleanedData = { ...data };

  // Ensure required fields are present
  cleanedData.name = cleanedData.name || '';
  cleanedData.email = cleanedData.email || '';
  cleanedData.phone = cleanedData.phone || '';
  cleanedData.college = cleanedData.college || '';
  cleanedData.program = cleanedData.program || '';
  cleanedData.inquiry = cleanedData.inquiry || '';

  // Remove unnecessary fields like '__v'
  delete cleanedData.__v;

  return cleanedData as Inquiry;
}