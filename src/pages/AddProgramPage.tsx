import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DashboardLayout } from "@/components/Dashboard/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { createProgram } from "@/services/programService";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import CollegeDropdown from "@/components/common/CollegeDropDown";
import { getColleges } from "@/services/collegeService";

// Define the Zod schema for form validation
const programFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  category: z.string().min(2, "Category is required"),
  duration: z.string().min(2, "Duration is required"),
  eligibility: z.string().min(10, "Eligibility criteria must be detailed"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  career: z.string().min(10, "Career prospects must be detailed"),
  features: z
    .array(z.string().min(1, "Feature cannot be empty"))
    .min(1, "At least one feature is required"),
});

type ProgramFormValues = z.infer<typeof programFormSchema>;

export default function AddProgramPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

    const [colleges, setColleges] = useState<{ _id: string; name: string }[]>([]);
    const [selectedColleges, setSelectedColleges] = useState<string[]>([]);
  // Initialize the form with default values
  const form = useForm<ProgramFormValues>({
    resolver: zodResolver(programFormSchema),
    defaultValues: {
      features: [""], // Start with one empty feature field
      title: "",
      category: "",
      duration: "",
      eligibility: "",
      description: "",
      career: "",
    },
  });

  // Handle form submission
  async function onSubmit(data: ProgramFormValues) {
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        colleges: selectedColleges, // Include selected colleges in the payload
      };
      await createProgram(payload); // Pass the updated payload
      toast({
        title: "Program created successfully",
        description: "You will be redirected to the programs list.",
      });
      navigate("/programs");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Helper function to add a new feature field
  const addFeatureField = () => {
    form.setValue("features", [...form.getValues("features"), ""]);
  };

  useEffect(() => {
    async function fetchColleges() {
      try {
        const collegesData = await getColleges();
        setColleges(collegesData);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch colleges. Please try again.",
        });
      }
    }
  
    fetchColleges();
  }, [toast]);
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back button */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            onClick={() => navigate("/programs")}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Programs</span>
          </Button>
        </div>

        {/* Page header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Program</h1>
          <p className="text-muted-foreground">
            Fill in the details below to create a new program.
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter program title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., Engineering" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Duration */}
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., 4 years" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Eligibility */}
            <FormField
              control={form.control}
              name="eligibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Eligibility Criteria</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe eligibility criteria"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write about the program"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Career Prospects */}
            <FormField
              control={form.control}
              name="career"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Career Prospects</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe career opportunities"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Features */}
            <FormField
              control={form.control}
              name="features"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Features</FormLabel>
                  {field.value.map((feature, index) => (
                    <FormControl key={index}>
                      <div className="flex items-center space-x-2">
                        <Input
                          placeholder="Enter feature"
                          value={feature}
                          onChange={(e) => {
                            const newFeatures = [...field.value];
                            newFeatures[index] = e.target.value;
                            field.onChange(newFeatures);
                          }}
                        />
                        {index > 0 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              const newFeatures = field.value.filter(
                                (_, i) => i !== index
                              );
                              field.onChange(newFeatures);
                            }}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </FormControl>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addFeatureField}
                  >
                    Add Feature
                  </Button>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Colleges</FormLabel>
              <FormControl>
                <CollegeDropdown
                  colleges={colleges}
                  selectedColleges={selectedColleges}
                  onChange={setSelectedColleges}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            {/* Submit and Cancel Buttons */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/programs")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Program"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </DashboardLayout>
  );
}
