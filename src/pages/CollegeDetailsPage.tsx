
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/Dashboard/DashboardLayout';
import { getCollege, College } from '@/services/collegeService';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { Spinner } from '@/components/common/Spinner';

export default function CollegeDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: college, isLoading } = useQuery({
    queryKey: ['college', id],
    queryFn: () => getCollege(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-96 items-center justify-center">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (!college) {
    return (
      <DashboardLayout>
        <div className="flex h-96 items-center justify-center">
          <p>College not found</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/colleges')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Colleges</span>
          </Button>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => navigate(`/colleges/${id}/edit`)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit College
            </Button>
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete College
            </Button>
          </div>
        </div>

        <div className="relative h-48 w-full overflow-hidden rounded-lg bg-muted">
          {college.banner ? (
            <img
              src={college.banner}
              alt={`${college.name} banner`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">No banner available</p>
            </div>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 overflow-hidden rounded-lg bg-background">
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
                <h1 className="text-3xl font-bold tracking-tight">
                  {college.name}
                </h1>
                <p className="text-muted-foreground">{college.location}</p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold">Description</h2>
              <p className="text-muted-foreground">{college.description}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold">Contact Information</h2>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Address:</span>{' '}
                  {college.contact.address}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{' '}
                  {college.contact.email}
                </p>
                <div>
                  <span className="font-medium">Phone:</span>
                  <ul className="list-inside list-disc">
                    {college.contact.phone.map((phone, index) => (
                      <li key={index}>{phone}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Programs</h2>
              <div className="mt-2 space-y-2">
                {Array.isArray(college.programs) && college.programs.length > 0 ? (
                  college.programs.map((program: any) => (
                    <div
                      key={program._id}
                      className="rounded-lg border p-4 hover:bg-accent"
                    >
                      <h3 className="font-medium">{program.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {program.duration} • {program.category}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No programs available</p>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold">Facilities</h2>
              <ul className="mt-2 list-inside list-disc space-y-1">
                {college.facilities.map((facility, index) => (
                  <li key={index}>{facility}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold">Faculty</h2>
              <div className="mt-2 grid gap-4 sm:grid-cols-2">
                {college.faculty.map((member) => (
                  <div
                    key={member._id}
                    className="rounded-lg border p-4 hover:bg-accent"
                  >
                    <div className="mb-2 h-24 w-24 overflow-hidden rounded-full">
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted">
                          <span className="text-xs text-muted-foreground">
                            No image
                          </span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-medium">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {member.position}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {member.qualification}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
