
import axios from 'axios';

const API_URL = 'http://localhost:3000/colleges';

export interface College {
  _id: string;
  name: string;
  shortName: string;
  logo?: string;
  banner?: string;
  description: string;
  location: Location;
  affiliation?: string;
  contact?: Contact;
  color: string;
  programs: (string | Program)[];
  facilities: string[];
  faculty: Faculty[];
  events: Event[];
}

interface Location{
  latitude: number;
  longitude: number;
  address?: string;
}

interface Contact {
  address?: string;
  phone?: string[];
  email?: string;
}

export interface Faculty {
  _id?: string;
  name: string;
  position: string;
  qualification: string;
  image: string;
}

export interface Event {
  _id?: string;
  title: string;
  date: string;
  description: string;
}

export interface Program {
  _id?: string;
  title: string;
  category: string;
  duration: string;
  eligibility?: string;
  description?: string;
  career?: string;
  features?: string[];
  colleges: College[];
}

export const getColleges = async (): Promise<College[]> => {
  try {
    const response = await axios.get(API_URL, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch colleges');
  }
};

export const getCollege = async (id: string): Promise<College> => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      withCredentials: true
    });
    console.log(response.data);
    return cleanCollegeData(response.data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch college');
  }
};

function cleanCollegeData(data: any): any {
  // Initialize cleaned data object
  const cleanedData: any = { ...data };

  // Parse 'contact' field from JSON string to object
  if (typeof cleanedData.contact === "string") {
    try {
      cleanedData.contact = JSON.parse(cleanedData.contact);
    } catch (error) {
      console.error("Failed to parse 'contact' field:", error);
      cleanedData.contact = {
        address: "",
        phone: [],
        email: "",
      };
    }
  }

  // Ensure 'contact.phone' is always an array
  if (!Array.isArray(cleanedData.contact.phone)) {
    cleanedData.contact.phone = [];
  }

  // Parse 'facilities' field from JSON string to array
  if (Array.isArray(cleanedData.facilities)) {
    cleanedData.facilities = cleanedData.facilities
      .map((facility: string) => {
        try {
          return JSON.parse(facility); // Parse each facility string
        } catch (error) {
          console.error("Failed to parse 'facilities' field:", error);
          return [];
        }
      })
      .flat(); // Flatten nested arrays
  } else {
    cleanedData.facilities = [];
  }

  // Ensure 'programs' is an array
  if (!Array.isArray(cleanedData.programs)) {
    cleanedData.programs = [];
  }

  // Ensure 'faculty' is an array
  if (!Array.isArray(cleanedData.faculty)) {
    cleanedData.faculty = [];
  }

  // Ensure 'events' is an array
  if (!Array.isArray(cleanedData.events)) {
    cleanedData.events = [];
  }

  // Remove unnecessary fields like '__v'
  delete cleanedData.__v;

  console.log(cleanedData);
  return cleanedData;
}

export const createCollege = async (college: Omit<College, '_id'>): Promise<College> => {
  try {
    const response = await axios.post(API_URL, college, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to create college');
  }
};

export const updateCollege = async (id: string, college: Partial<College>): Promise<College> => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, college, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to update college');
  }
};

export const deleteCollege = async (id: string): Promise<{ message: string }> => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to delete college');
  }
};

export const uploadCollegeLogo = async (id: string, file: File): Promise<{ message: string; college: College }> => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await axios.post(`${API_URL}/${id}/upload-logo`, formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to upload logo');
  }
};

export const uploadCollegeBanner = async (id: string, file: File): Promise<{ message: string; college: College }> => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await axios.post(`${API_URL}/${id}/upload-banner`, formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to upload banner');
  }
};

export const uploadFacultyImage = async (
  collegeId: string,
  facultyId: string,
  file: File
): Promise<{ message: string; college: College }> => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await axios.post(
      `${API_URL}/${collegeId}/faculty/${facultyId}/upload-image`,
      formData,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to upload faculty image');
  }
};
