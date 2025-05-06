// src/types/gallery.ts
export type College = {
  _id: string;
  name: string;
  shortName?: string;
};

export type GalleryImage = {
  _id?: string;
  src: string;
  alt: string;
  category: string;
  title: string;
  description: string;
  colleges: College[] | string[];
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
};

  export interface GalleryProps {
    images: GalleryImage[];
    title?: string;
    description?: string;
    categories?: string[];
    columns?: number;
    filters: boolean;
    className?: string;
    filterType?: 'category' | 'college' | 'tag';
  }
  
  export interface FilterOption {
    value: string;
    label: string;
    count: number;
  }
  
  export type ApiResponse<T> = {
    data: T;
    status: number;
    message: string;
  };
  