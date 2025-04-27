
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/Dashboard/DashboardLayout';
import { getColleges } from '@/services/collegeService';
import { getPrograms } from '@/services/programService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { School, BookOpen, User, Calendar } from 'lucide-react';
import { Spinner } from '@/components/common/Spinner';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const DashboardCard = ({ 
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const DashboardPage = () => {
  const { data: colleges, isLoading: isLoadingColleges } = useQuery({
    queryKey: ['colleges'],
    queryFn: getColleges,
  });

  const { data: programs, isLoading: isLoadingPrograms } = useQuery({
    queryKey: ['programs'],
    queryFn: getPrograms,
  });

  // Prepare data for the chart
  const chartData = colleges?.map(college => ({
    name: college.shortName,
    programs: Array.isArray(college.programs) ? college.programs.length : 0,
    faculty: college.faculty.length,
    events: college.events.length,
  })) || [];

  if (isLoadingColleges || isLoadingPrograms) {
    return (
      <DashboardLayout>
        <div className="flex h-96 items-center justify-center">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  // Calculate statistics
  const totalColleges = colleges?.length || 0;
  const totalPrograms = programs?.length || 0;
  const totalFaculty = colleges?.reduce((acc, college) => acc + college.faculty.length, 0) || 0;
  const totalEvents = colleges?.reduce((acc, college) => acc + college.events.length, 0) || 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your college management dashboard. Here's an overview of your data.
        </p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Total Colleges"
            value={totalColleges}
            description="All registered institutions"
            icon={<School className="h-4 w-4" />}
          />
          <DashboardCard
            title="Total Programs"
            value={totalPrograms}
            description="Across all institutions"
            icon={<BookOpen className="h-4 w-4" />}
          />
          <DashboardCard
            title="Faculty Members"
            value={totalFaculty}
            description="All teaching staff"
            icon={<User className="h-4 w-4" />}
          />
          <DashboardCard
            title="Upcoming Events"
            value={totalEvents}
            description="Scheduled in all colleges"
            icon={<Calendar className="h-4 w-4" />}
          />
        </div>

        {chartData.length > 0 && (
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>College Comparison</CardTitle>
              <CardDescription>
                Number of programs, faculty, and events by college
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="programs" fill="#8884d8" name="Programs" />
                    <Bar dataKey="faculty" fill="#82ca9d" name="Faculty" />
                    <Bar dataKey="events" fill="#ffc658" name="Events" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
