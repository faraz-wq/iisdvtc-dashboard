import { GalleryImage, ApiResponse, FilterOption } from "../types/gallery";

const VITE_URL = import.meta.env.VITE_API_URL + "/gallery";

const API_BASE_URL = VITE_URL || "http://localhost:5000/gallery";

export const galleryApi = {
  // Get all gallery images
  getImages: async (): Promise<ApiResponse<GalleryImage[]>> => {
    const response = await fetch(API_BASE_URL);
    return handleFetchResponse<ApiResponse<GalleryImage[]>>(response);
  },

  // Get a single image by ID
  getImageById: async (
    id: string
  ): Promise<ApiResponse<GalleryImage | null>> => {
    const response = await fetch(`${API_BASE_URL}/id?id=${id}`);
    return handleFetchResponse<ApiResponse<GalleryImage | null>>(response);
  },

  getImageByCollege: async (
    id: string
  ): Promise<ApiResponse<GalleryImage[]>> => {
    const response = await fetch(`${API_BASE_URL}/college/${id}`);
    return handleFetchResponse<ApiResponse<GalleryImage[]>>(response);
  },

  // Upload a new gallery image
  uploadImage: async (
    formData: FormData
  ): Promise<ApiResponse<GalleryImage>> => {
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      body: formData,
      // Do NOT set Content-Type header when using FormData
    });
    return handleFetchResponse<ApiResponse<GalleryImage>>(response);
  },

  // Update an existing gallery image
  updateImage: async (
    id: string,
    formData: FormData
  ): Promise<ApiResponse<GalleryImage>> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      body: formData,
    });
    return handleFetchResponse<ApiResponse<GalleryImage>>(response);
  },

  // Delete a gallery image
  deleteImage: async (id: string): Promise<ApiResponse<void>> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    });
    return handleFetchResponse<ApiResponse<void>>(response);
  },
};

// src/utils/fetchUtils.ts
export const handleFetchResponse = async <T>(
  response: Response
): Promise<T> => {
  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Unknown error" }));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }
  console.log("response", response);
  return await response.json();
};
