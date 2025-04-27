
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { DashboardLayout } from '@/components/Dashboard/DashboardLayout';
import { useToast } from '@/hooks/use-toast';
import { createProgram } from '@/services/programService';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';

const programFormSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  category: z.string().min(2, 'Category is required'),
  duration: z.string().min(2, 'Duration is required'),
  eligibility: z.string().min(10, 'Eligibility criteria must be detailed'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  career: z.string().min(10, 'Career prospects must be detailed'),
  features: z.array(z.string()).min(1, 'At least one feature is required'),
});

type ProgramFormValues = z.infer<typeof programFormSchema>;

export default function AddProgramPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProgramFormValues>({
    resolver: zodResolver(programFormSchema),
    defaultValues: {
      features: [''],
    },
  });

  async function onSubmit(data: ProgramFormValues) {
    setIsLoading(true);
    try {
      await createProgram(data);
      toast({
        title: 'Program created successfully',
        description: 'You will be redirected to programs list',
      });
      navigate('/programs');
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
            onClick={() => navigate('/programs')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Programs</span>
          </Button>
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Program</h1>
          <p className="text-muted-foreground">
            Fill in the details below to create a new program.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/programs')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Program'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </DashboardLayout>
  );
}
