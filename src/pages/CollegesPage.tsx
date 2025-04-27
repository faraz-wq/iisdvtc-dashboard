
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getColleges } from '@/services/collegeService';
import { DashboardLayout } from '@/components/Dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus } from 'lucide-react';
import { Spinner } from '@/components/common/Spinner';

const CollegesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: colleges, isLoading } = useQuery({
    queryKey: ['colleges'],
    queryFn: getColleges,
  });

  const filteredColleges = colleges?.filter(college =>
    college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    college.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Colleges</h1>
            <p className="text-muted-foreground">
              Manage your educational institutions here
            </p>
          </div>
          <Link to="/colleges/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add College
            </Button>
          </Link>
        </div>
        
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search colleges..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="flex h-96 items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredColleges?.map((college) => (
              <Link
                to={`/colleges/${college._id}`}
                key={college._id}
                className="group"
              >
                <div className="overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-md">
                  <div className="relative h-40 w-full bg-muted">
                    {college.banner ? (
                      <img
                        src={college.banner}
                        alt={`${college.name} banner`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted">
                        <span className="text-muted-foreground">No banner available</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 overflow-hidden rounded-md bg-background">
                        {college.logo ? (
                          <img
                            src={college.logo}
                            alt={`${college.name} logo`}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-muted">
                            <span className="text-xs text-muted-foreground">No logo</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium group-hover:text-primary transition-colors">
                          {college.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {college.location}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center space-x-2">
                      <div className="rounded-md bg-primary/10 px-2 py-1 text-xs text-primary">
                        {Array.isArray(college.programs) ? college.programs.length : 0} Programs
                      </div>
                      <div className="rounded-md bg-primary/10 px-2 py-1 text-xs text-primary">
                        {college.faculty.length} Faculty
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {filteredColleges?.length === 0 && (
              <div className="col-span-full flex h-96 items-center justify-center rounded-lg border border-dashed border-border bg-muted/30">
                <div className="text-center">
                  <p className="text-muted-foreground">No colleges found</p>
                  <Link to="/colleges/new">
                    <Button variant="link" className="mt-2">
                      Add your first college
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CollegesPage;
