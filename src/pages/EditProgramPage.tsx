import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DashboardLayout } from "@/components/Dashboard/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { getProgram, updateProgram } from "@/services/programService";
import { getColleges } from "@/services/collegeService";
import CollegeDropdown from "@/components/common/CollegeDropDown";

// Define the schema for validation
const programFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  category: z.string().min(2, "Category is required"),
  duration: z.string().min(2, "Duration is required"),
  eligibility: z.string().min(10, "Eligibility criteria must be detailed"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  career: z.string().min(10, "Career prospects must be detailed"),
  features: z.array(z.string()).min(1, "At least one feature is required"),
});

type ProgramFormValues = z.infer<typeof programFormSchema>;

export default function EditProgramPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [colleges, setColleges] = useState<{ _id: string; name: string }[]>([]);
  const [selectedColleges, setSelectedColleges] = useState<string[]>([]);
  const [programData, setProgramData] = useState<any>(null);

  const form = useForm<ProgramFormValues>({
    resolver: zodResolver(programFormSchema),
    defaultValues: {
      features: [""],
      title: "",
      category: "",
      duration: "",
      eligibility: "",
      description: "",
      career: "",
    },
  });

  // Fetch the program data and available colleges
  useEffect(() => {
    async function fetchData() {
      try {
        if (!id) return;

        // Fetch the program details
        const program = await getProgram(id);
        setProgramData(program);

        // Populate the form with the program data
        form.reset({
          title: program.title,
          category: program.category,
          duration: program.duration,
          eligibility: program.eligibility,
          description: program.description,
          career: program.career,
          features: program.features || [""],
        });

        setSelectedColleges(
          program.colleges?.map((college) => college._id) || []
        );

        // Fetch all colleges
        const collegesData = await getColleges();
        setColleges(collegesData);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      }
    }

    fetchData();
  }, [id, form, navigate, toast]);

  // Handle form submission
  async function onSubmit(data: ProgramFormValues) {
    setIsLoading(true);
    try {
      const updatePayload = {
        ...data,
        addColleges: selectedColleges.filter(
          (collegeId) => !programData.colleges?.includes(collegeId)
        ),
        removeColleges: programData.colleges?.filter(
          (collegeId: string) => !selectedColleges.includes(collegeId)
        ),
      };

      await updateProgram(id!, updatePayload);
      toast({
        title: "Program updated successfully",
        description: "You will be redirected to programs list",
      });
      navigate("/programs");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
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
            onClick={() => navigate("/programs")}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Programs</span>
          </Button>
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Program</h1>
          <p className="text-muted-foreground">
            Update the details of the program below.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Program Title */}
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

            {/* Colleges Dropdown */}
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

            {/* Buttons */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/programs")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Program"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </DashboardLayout>
  );
}
