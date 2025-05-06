import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { GalleryImage, College } from "@/types/gallery";
import { ImagePlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MultiSelect } from "@/components/ui/multi-select";
import { useQuery } from "@tanstack/react-query";
import { getColleges } from "@/services/collegeService";
import CollegeDropdown from "../common/CollegeDropDown";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  alt: z.string().min(1, { message: "Alt text is required" }),
  tags: z.string().optional(),
  colleges: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema> & {
  imageFile?: FileList;
};

interface ImageFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  image?: GalleryImage;
}

const ImageForm = ({ isOpen, onClose, onSubmit, image }: ImageFormProps) => {
  const [preview, setPreview] = useState<string | undefined>(
    image?.src || undefined
  );
  const [isLoading, setIsLoading] = useState(false);
  const [selectedColleges, setSelectedColleges] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const { data: colleges = [] } = useQuery({
    queryKey: ["colleges"],
    queryFn: async () => {
      const res = await getColleges();
      return res || [];
    },
    enabled: isOpen,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: image?.title || "",
      description: image?.description || "",
      category: image?.category || "",
      alt: image?.alt || "",
      tags: image?.tags?.join(", ") || "",
      colleges: [],
    },
    shouldUnregister: false,
  });

  useEffect(() => {
    if (image) {
      const collegeIds = image.colleges.map((college) =>
        typeof college === "string" ? college : college._id
      );
      form.reset({
        title: image.title,
        description: image.description,
        category: image.category,
        alt: image.alt,
        tags: image.tags?.join(", "),
        colleges: collegeIds,
      });
      setSelectedColleges(collegeIds);
      setPreview(image.src);
    } else {
      form.reset({
        title: "",
        description: "",
        category: "",
        alt: "",
        tags: "",
        colleges: [],
      });
      setSelectedColleges([]);
      setPreview(undefined);
    }
  }, [image, form]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file); // store separately
      form.setValue("imageFile", event.target.files);
  
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCollegeChange = (selected: string[]) => {
    setSelectedColleges(selected);
    form.setValue("colleges", selected);
  };

  const handleSubmit = async (values: FormValues) => {
    setIsLoading(true);

    try {
      console.log("Form values before submission:", values);

      const formData = new FormData();

      if (selectedImage) {
        formData.append("image", selectedImage);
      } else {
        console.warn("No image file selected.");
      }

      if (values.imageFile) {
        console.log("Appending image file:", values.imageFile[0]);
        formData.append("image", values.imageFile[0]);
      } else {
        console.warn("No image file selected.");
      }

      if (!selectedImage && !image) {
        console.warn("Please select an image to upload.");
        setIsLoading(false);
        return;
      }
      // Append other fields
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("category", values.category);
      formData.append("alt", values.alt);

      // Tags
      const tags = values.tags
        ? values.tags.split(",").map((tag) => tag.trim())
        : [];
      tags.forEach((tag, index) => {
        formData.append(`tags[${index}]`, tag);
      });

      // Colleges
      if (values.colleges && values.colleges.length > 0) {
        values.colleges.forEach((collegeId, index) => {
          formData.append(`colleges[${index}]`, collegeId);
        });
      }

      console.log("Final FormData entries:");
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{image ? "Edit Image" : "Add New Image"}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[70vh] pr-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <div className="mb-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {preview ? (
                    <div className="relative aspect-square max-h-[200px] overflow-hidden mx-auto">
                      <img
                        src={preview}
                        alt="Preview"
                        className="object-cover w-full h-full rounded"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-4">
                      <ImagePlus className="w-12 h-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">
                        Drag and drop an image or click to browse
                      </p>
                    </div>
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    className="mt-4"
                    onChange={(e) => {
                      handleImageChange(e); 
                    }}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Image title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Describe the image"
                        className="min-h-[80px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Image category" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="alt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alt Text</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Alternative text" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (comma separated)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="nature, landscape, etc." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="colleges"
                render={() => (
                  <FormItem>
                    <FormLabel>Colleges</FormLabel>
                    <FormControl>
                      <CollegeDropdown
                        colleges={colleges}
                        selectedColleges={selectedColleges}
                        onChange={handleCollegeChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2 pt-4 pb-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading
                    ? "Saving..."
                    : image
                    ? "Update Image"
                    : "Add Image"}
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ImageForm;
