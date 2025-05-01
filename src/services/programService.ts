
import axios from 'axios';
import { Program } from './collegeService';

const API_URL = `${import.meta.env.VITE_API_URL}/programs`;

export const getPrograms = async (): Promise<Program[]> => {
  try {
    const response = await axios.get(API_URL, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch programs');
  }
};

export const getProgram = async (id: string): Promise<Program> => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch program');
  }
};

export const createProgram = async (program: Omit<Program, '_id'>): Promise<Program> => {
  try {
    const response = await axios.post(API_URL, program, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to create program');
  }
};

export const updateProgram = async (id: string, program: Partial<Program>): Promise<Program> => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, program, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to update program');
  }
};

export const deleteProgram = async (id: string): Promise<{ message: string }> => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to delete program');
  }
};
