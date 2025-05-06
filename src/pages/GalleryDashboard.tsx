import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/components/ui/use-toast";  
import { Button } from "@/components/ui/button";
import { Plus, RefreshCcw } from "lucide-react";
import { GalleryImage } from "@/types/gallery";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { galleryApi } from "@/services/galleryService";
import ImageForm from "@/components/gallery/ImageForm";
import ImageCard from "@/components/gallery/ImageCard";
import { DashboardLayout } from "@/components/Dashboard/DashboardLayout";

const GalleryDashboard = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | undefined>(
    undefined
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["galleryImages"],
    queryFn: async () => {
      const response = await galleryApi.getImages();
      return response.data;
    },
  });

  const uploadMutation = useMutation({
    mutationFn: (formData: FormData) => galleryApi.uploadImage(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["galleryImages"] });
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      formData,
    }: {
      id: string;
      formData: FormData;
    }) => galleryApi.updateImage(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["galleryImages"] });
      toast({
        title: "Success",
        description: "Image updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update image",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => galleryApi.deleteImage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["galleryImages"] });
      toast({
        title: "Success",
        description: "Image deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive",
      });
    },
  });

  const handleFormSubmit = async (formData: FormData) => {
    try {
      if (editingImage && editingImage._id) {
        await updateMutation.mutateAsync({
          id: editingImage._id,
          formData,
        });
      } else {
        await uploadMutation.mutateAsync(formData);
      }
      closeForm();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleEditImage = (image: GalleryImage) => {
    setEditingImage(image);
    setIsFormOpen(true);
  };

  const handleDeleteImage = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const openForm = () => {
    setEditingImage(undefined);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingImage(undefined);
  };

  const filterImages = useMemo(() => {
    if (!data) return [];

    return data.filter((image) => {
      const matchesSearch =
        !searchTerm ||
        image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        image.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = !categoryFilter || image.category === categoryFilter;

      const matchesTag =
        !tagFilter ||
        (image.tags && image.tags.some((tag) => tag === tagFilter));

      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [data, searchTerm, categoryFilter, tagFilter]);

  const filterOptions = useMemo(() => {
    if (!data) return { categories: [], tags: [] };

    const categories = new Map<string, number>();
    const tags = new Map<string, number>();

    data.forEach((image) => {
      // Count categories
      if (image.category) {
        const count = categories.get(image.category) || 0;
        categories.set(image.category, count + 1);
      }

      // Count tags
      if (image.tags && image.tags.length > 0) {
        image.tags.forEach((tag) => {
          const count = tags.get(tag) || 0;
          tags.set(tag, count + 1);
        });
      }
    });

    return {
      categories: Array.from(categories.entries()).map(([value, count]) => ({
        value,
        label: value,
        count,
      })),
      tags: Array.from(tags.entries()).map(([value, count]) => ({
        value,
        label: value,
        count,
      })),
    };
  }, [data]);

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Gallery Dashboard</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={openForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Image
            </Button>
          </div>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-muted animate-pulse h-64 rounded-lg"
              ></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-destructive">
              Error loading images. Please try again.
            </p>
            <Button
              variant="outline"
              onClick={() => refetch()}
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        ) : filterImages.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No images found</p>
            {(searchTerm || categoryFilter || tagFilter) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter("");
                  setTagFilter("");
                }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filterImages.map((image) => (
              <ImageCard
                key={image._id}
                image={image}
                onEdit={handleEditImage}
                onDelete={handleDeleteImage}
              />
            ))}
          </div>
        )}
        <ImageForm
          isOpen={isFormOpen}
          onClose={closeForm}
          onSubmit={handleFormSubmit}
          image={editingImage}
        />
      </div>
    </DashboardLayout>
  );
};

export default GalleryDashboard;
