
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
import { ArrowLeft } from 'lucide-react';

const collegeFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  shortName: z.string().min(2, 'Short name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().min(2, 'Location is required'),
  affiliation: z.string().optional(),
  contact: z.object({
    address: z.string().min(5, 'Address is required'),
    phone: z.array(z.string()).min(1, 'At least one phone number is required'),
    email: z.string().email('Invalid email address'),
  }),
  color: z.string(),
  facilities: z.array(z.string()),
  logo: z.string().default('https://via.placeholder.com/150'),
  banner: z.string().default('https://via.placeholder.com/1200x400'),
});

type CollegeFormValues = z.infer<typeof collegeFormSchema>;

export default function AddCollegePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CollegeFormValues>({
    resolver: zodResolver(collegeFormSchema),
    defaultValues: {
      facilities: [],
      contact: {
        phone: [''],
      },
    },
  });

  async function onSubmit(data: CollegeFormValues) {
    setIsLoading(true);
    try {
      await createCollege(data);
      toast({
        title: 'College created successfully',
        description: 'You will be redirected to colleges list',
      });
      navigate('/colleges');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Something went wrong. Please try again.',
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
            Fill in the details below to create a new college.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>College Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter college name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shortName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Name</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., MIT" {...field} />
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
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="City, State" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
