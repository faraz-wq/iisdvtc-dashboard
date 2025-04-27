import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { College } from "@/services/collegeService";
import { DashboardLayout } from "@/components/Dashboard/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { updateCollege, getCollege } from "@/services/collegeService";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";

// Reuse the same Zod schema from AddCollegePage
const collegeFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  shortName: z
    .string()
    .min(2, "Short name must be at least 2 characters")
    .max(20),
  description: z.string().min(10, "Description must be detailed").max(1000),
  location: z.string().min(2, "Location is required"),
  contact: z.object({
    address: z.string().min(5, "Address is required"),
    phone: z.array(z.string().min(1, "Phone number is required")),
    email: z.string().email("Invalid email address"),
  }),
  affiliation: z.string().optional(),
  color: z.string().default("#3B82F6"),
  facilities: z.array(z.string()).default([]),
  logo: z.string().optional(),
  banner: z.string().optional(),
  programs: z.array(z.string()).default([]).optional(),
  faculty: z
    .array(
      z.object({
        name: z.string().min(2, "Name is required"),
        position: z.string().min(2, "Position is required"),
        qualification: z.string().min(2, "Qualification is required"),
        image: z.string().optional(),
      })
    )
    .default([]),
  events: z
    .array(
      z.object({
        title: z.string().min(2, "Title is required"),
        date: z.string().min(2, "Date is required"),
        description: z.string().optional(),
      })
    )
    .default([]),
});

type CollegeFormValues = z.infer<typeof collegeFormSchema>;

export default function EditCollegePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [facultyImages, setFacultyImages] = useState<File[]>([]);

  // Initialize the form with default values
  const form = useForm<CollegeFormValues>({
    resolver: zodResolver(collegeFormSchema),
    defaultValues: {
      color: "#3B82F6",
      facilities: [],
      programs: [],
      faculty: [],
      events: [],
      contact: {
        phone: [""],
        address: "",
        email: "",
      },
    },
  });

  const {
    fields: facultyFields,
    append: appendFaculty,
    remove: removeFaculty,
  } = useFieldArray({
    control: form.control,
    name: "faculty",
  });

  const {
    fields: eventFields,
    append: appendEvent,
    remove: removeEvent,
  } = useFieldArray({
    control: form.control,
    name: "events",
  });

  // Fetch the college data by ID
  useEffect(() => {
    async function fetchCollegeData() {
      try {
        if (id) {
          const collegeData = await getCollege(id);
  
          // Transform the programs array to match the expected type
          const programs = Array.isArray(collegeData.programs)
            ? collegeData.programs.map((program) =>
                typeof program === "string" ? program : program.title // Extract name if it's an object
              )
            : [];
  
          form.reset({
            ...collegeData,
            contact: {
              ...collegeData.contact,
              phone: Array.isArray(collegeData.contact.phone)
                ? collegeData.contact.phone
                : [collegeData.contact.phone],
            },
            facilities: Array.isArray(collegeData.facilities)
              ? collegeData.facilities
              : [],
            faculty: Array.isArray(collegeData.faculty)
              ? collegeData.faculty
              : [],
            events: Array.isArray(collegeData.events)
              ? collegeData.events
              : [],
            programs, // Use the transformed programs array
          });
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description:
            error instanceof Error ? error.message : "Failed to load college data",
        });
      }
    }
  
    fetchCollegeData();
  }, [id, form, toast]);
  // Handle form submission
  async function onSubmit(data: CollegeFormValues) {
    setIsLoading(true);
    try {
      const formData = new FormData();

      // Append non-file fields
      formData.append("name", data.name);
      formData.append("shortName", data.shortName);
      formData.append("description", data.description);
      formData.append("location", data.location);
      formData.append("affiliation", data.affiliation || "");
      formData.append("color", data.color);
      formData.append("facilities", JSON.stringify(data.facilities));
      formData.append("contact", JSON.stringify(data.contact));
      formData.append("faculty", JSON.stringify(data.faculty));
      formData.append("events", JSON.stringify(data.events));

      // Append files
      if (logoFile) formData.append("logo", logoFile);
      if (bannerFile) formData.append("banner", bannerFile);
      facultyImages.forEach((file, index) =>
        formData.append(`facultyImages`, file)
      );

      // Call the backend API to update the college
      await updateCollege(id!, formData);

      toast({
        title: "College updated successfully",
        description: "You will be redirected to colleges list",
      });
      navigate("/colleges");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  }

  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            onClick={() => navigate("/colleges")}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Colleges</span>
          </Button>
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit College</h1>
          <p className="text-muted-foreground">
            Update the college details. Required fields are marked with an
            asterisk (*).
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Basic Information</h2>
              <Separator />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>College Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full college name" {...field} />
                    </FormControl>
                    <FormDescription>
                      The official name of the college
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shortName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., MIT" {...field} />
                    </FormControl>
                    <FormDescription>
                      A brief version of the college name
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write about the college"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location *</FormLabel>
                    <FormControl>
                      <Input placeholder="City, State, Country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Contact Information Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Contact Information</h2>
              <Separator />
              <FormField
                control={form.control}
                name="contact.address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Complete postal address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contact.email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="college@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contact.phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Numbers *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+1 234 567 8900"
                        value={field.value.join(", ")}
                        onChange={(e) => {
                          const rawInput = e.target.value;
                          const phoneNumbers = rawInput
                            .split(",")
                            .map((num) => num.trim())
                            .filter((num) => num.length > 0);
                          field.onChange(phoneNumbers);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Add at least one contact number
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Additional Information Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Additional Information</h2>
              <Separator />
              <FormField
                control={form.control}
                name="affiliation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Affiliation</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="University affiliation (if any)"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional: Enter any university affiliations
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand Color</FormLabel>
                    <FormControl>
                      <Input type="color" {...field} />
                    </FormControl>
                    <FormDescription>
                      Choose a primary brand color for the college
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="facilities"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facilities</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Add facilities (comma-separated)"
                        value={field.value.join(", ")}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value.split(",").map((f) => f.trim())
                          )
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Enter available facilities (e.g., Library, Gym)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Faculty Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Faculty Members</h2>
              <Separator />
              {facultyFields.map((item, index) => (
                <div key={item.id} className="space-y-2 border p-4 rounded-lg">
                  <FormField
                    control={form.control}
                    name={`faculty.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Faculty member's name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`faculty.${index}.position`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position *</FormLabel>
                        <FormControl>
                          <Input placeholder="Position" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`faculty.${index}.qualification`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Qualification *</FormLabel>
                        <FormControl>
                          <Input placeholder="Qualification" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`faculty.${index}.image`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                field.onChange(URL.createObjectURL(file));
                                setFacultyImages((prev) => [...prev, file]);
                              }
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Upload faculty member's image
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="button" onClick={() => removeFaculty(index)}>
                    Remove Faculty
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={() =>
                  appendFaculty({
                    name: "",
                    position: "",
                    qualification: "",
                    image: "",
                  })
                }
              >
                Add Faculty Member
              </Button>
            </div>

            {/* Events Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Events</h2>
              <Separator />
              {eventFields.map((item, index) => (
                <div key={item.id} className="space-y-2 border p-4 rounded-lg">
                  <FormField
                    control={form.control}
                    name={`events.${index}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title *</FormLabel>
                        <FormControl>
                          <Input placeholder="Event title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`events.${index}.date`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`events.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Event description"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="button" onClick={() => removeEvent(index)}>
                    Remove Event
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={() =>
                  appendEvent({ title: "", date: "", description: "" })
                }
              >
                Add Event
              </Button>
            </div>

            {/* Logo and Banner Uploads */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Logo and Banner</h2>
              <Separator />
              <FormField
                control={form.control}
                name="logo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            field.onChange(URL.createObjectURL(file));
                            setLogoFile(file);
                          }
                        }}
                      />
                    </FormControl>
                    <FormDescription>Upload the college logo</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="banner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banner</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            field.onChange(URL.createObjectURL(file));
                            setBannerFile(file);
                          }
                        }}
                      />
                    </FormControl>
                    <FormDescription>Upload the college banner</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/colleges")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update College"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </DashboardLayout>
  );
}

// Helper function to upload files (mock implementation)
async function uploadFiles(formData: FormData) {
  // Replace this with actual API calls to upload files to a cloud service
  return {
    logo: "https://via.placeholder.com/150",
    banner: "https://via.placeholder.com/1200x400",
  };
}