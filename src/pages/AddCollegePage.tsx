
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { College } from '@/services/collegeService';
import { DashboardLayout } from '@/components/Dashboard/DashboardLayout';
import { useToast } from '@/hooks/use-toast';
import { createCollege } from '@/services/collegeService';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft } from 'lucide-react';

const collegeFormSchema = z.object({
  // Basic Information (Required)
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  shortName: z.string().min(2, 'Short name must be at least 2 characters').max(20),
  description: z.string().min(10, 'Description must be detailed').max(1000),
  location: z.string().min(2, 'Location is required'),
  
  // Contact Information (Required)
  contact: z.object({
    address: z.string().min(5, 'Address is required'),
    phone: z.array(z.string().min(1, 'Phone number is required')),
    email: z.string().email('Invalid email address'),
  }),

  // Additional Information (Optional)
  affiliation: z.string().optional(),
  color: z.string().default('#3B82F6'),
  facilities: z.array(z.string()).default([]),
  
  // Images (Optional with defaults)
  logo: z.string().default('https://via.placeholder.com/150'),
  banner: z.string().default('https://via.placeholder.com/1200x400'),
  
  // Related Data (Optional)
  programs: z.array(z.string()).default([]),
  faculty: z.array(z.object({
    name: z.string(),
    position: z.string(),
    qualification: z.string(),
    image: z.string().default('https://via.placeholder.com/150'),
  })).default([]),
  events: z.array(z.object({
    title: z.string(),
    date: z.string(),
    description: z.string().default(''),
  })).default([]),
});

type CollegeFormValues = z.infer<typeof collegeFormSchema>;

export default function AddCollegePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CollegeFormValues>({
    resolver: zodResolver(collegeFormSchema),
    defaultValues: {
      color: '#3B82F6',
      facilities: [],
      programs: [],
      faculty: [],
      events: [],
      contact: {
        phone: [''],
        address: '',
        email: '',
      },
    },
  });

  async function onSubmit(data: CollegeFormValues) {
    setIsLoading(true);
    try {
      await createCollege(data as Omit<College, "_id">);
      toast({
        title: 'College created successfully',
        description: 'You will be redirected to colleges list',
      });
      navigate('/colleges');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Something went wrong',
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
            onClick={() => navigate('/colleges')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Colleges</span>
          </Button>
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New College</h1>
          <p className="text-muted-foreground">
            Fill in the college details. Required fields are marked with an asterisk (*).
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
                        className="min-h-[100px]"
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
                      <Textarea placeholder="Complete postal address" {...field} />
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
                      <Input type="email" placeholder="college@example.com" {...field} />
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
                      <Input placeholder="+1 234 567 8900" {...field} />
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
                      <Input placeholder="University affiliation (if any)" {...field} />
                    </FormControl>
                    <FormDescription>Optional: Enter any university affiliations</FormDescription>
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
                    <FormDescription>Choose a primary brand color for the college</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/colleges')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create College'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </DashboardLayout>
  );
}
