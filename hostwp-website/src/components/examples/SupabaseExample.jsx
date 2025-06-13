import React from 'react';
import { useServices, useProjects, useCaseStudies, useTeamMembers } from '../../hooks/useSupabase';
import Card, { CardBody, CardTitle } from '../ui/Card';
import Badge from '../ui/Badge';

const SupabaseExample = () => {
  // Fetch data using custom hooks
  const { data: services, loading: servicesLoading, error: servicesError } = useServices({ featured: true });
  const { data: projects, loading: projectsLoading, error: projectsError } = useProjects({ featured: true });
  const { data: caseStudies, loading: caseStudiesLoading, error: caseStudiesError } = useCaseStudies({ featured: true });
  const { data: teamMembers, loading: teamLoading, error: teamError } = useTeamMembers();

  if (servicesLoading || projectsLoading || caseStudiesLoading || teamLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading data from Supabase...</p>
        </div>
      </div>
    );
  }

  if (servicesError || projectsError || caseStudiesError || teamError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️ Error loading data</div>
          <p className="text-gray-600">
            {servicesError?.message || projectsError?.message || caseStudiesError?.message || teamError?.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🎉 Supabase Integration Success!
        </h1>
        <p className="text-xl text-gray-600">
          Your React app is now connected to Supabase and fetching real data.
        </p>
      </div>

      {/* Services Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services?.map((service) => (
            <Card key={service.id} className="hover:shadow-lg transition-shadow">
              <CardBody>
                <div className="flex items-center mb-3">
                  {service.icon_name && (
                    <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-primary-600 text-sm">{service.icon_name}</span>
                    </div>
                  )}
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                </div>
                <p className="text-gray-600 text-sm mb-4">{service.short_description}</p>
                <div className="flex flex-wrap gap-2">
                  {service.technologies?.slice(0, 3).map((tech, index) => (
                    <Badge key={index} variant="outline" size="sm">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects?.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardBody>
                <CardTitle className="text-lg mb-3">{project.name}</CardTitle>
                <p className="text-gray-600 text-sm mb-4">{project.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="primary" size="sm">
                    {project.category}
                  </Badge>
                  {project.url && (
                    <a 
                      href={project.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      View Project →
                    </a>
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Case Studies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {caseStudies?.map((caseStudy) => (
            <Card key={caseStudy.id} className="hover:shadow-lg transition-shadow">
              <CardBody>
                <CardTitle className="text-lg mb-2">{caseStudy.title}</CardTitle>
                <p className="text-primary-600 font-medium text-sm mb-3">{caseStudy.client_name}</p>
                <p className="text-gray-600 text-sm mb-4">{caseStudy.subtitle}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {caseStudy.services?.slice(0, 2).map((service, index) => (
                    <Badge key={index} variant="success" size="sm">
                      {service}
                    </Badge>
                  ))}
                </div>
                <div className="text-xs text-gray-500">
                  {caseStudy.industry} • {caseStudy.project_duration}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      {/* Team Members Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Team Members</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers?.slice(0, 8).map((member) => (
            <Card key={member.id} className="text-center hover:shadow-lg transition-shadow">
              <CardBody>
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-gray-500 text-xl">👤</span>
                </div>
                <CardTitle className="text-base mb-1">{member.name}</CardTitle>
                <p className="text-primary-600 text-sm font-medium mb-2">{member.role}</p>
                <p className="text-gray-600 text-xs mb-3">{member.location}</p>
                <div className="flex flex-wrap gap-1 justify-center">
                  {member.expertise?.slice(0, 2).map((skill, index) => (
                    <Badge key={index} variant="outline" size="sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      {/* Database Stats */}
      <section className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Database Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">{services?.length || 0}</div>
            <div className="text-sm text-gray-600">Services</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">{projects?.length || 0}</div>
            <div className="text-sm text-gray-600">Projects</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">{caseStudies?.length || 0}</div>
            <div className="text-sm text-gray-600">Case Studies</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">{teamMembers?.length || 0}</div>
            <div className="text-sm text-gray-600">Team Members</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SupabaseExample; 