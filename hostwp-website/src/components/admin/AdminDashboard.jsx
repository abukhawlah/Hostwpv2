import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Users,
  FileText,
  Image,
  ShoppingCart,
  TrendingUp,
  Eye,
  Plus,
  Edit,
  Activity,
  Calendar,
  Clock,
  CheckCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Card from '../ui/Card';
import Button from '../ui/Button';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    services: 0,
    projects: 0,
    caseStudies: 0,
    teamMembers: 0,
    images: 0,
    products: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch counts for all main entities
      const [
        servicesResult,
        projectsResult,
        caseStudiesResult,
        teamResult,
        imagesResult,
        productsResult
      ] = await Promise.all([
        supabase.from('services').select('*', { count: 'exact', head: true }),
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('case_studies').select('*', { count: 'exact', head: true }),
        supabase.from('team_members').select('*', { count: 'exact', head: true }),
        supabase.from('images').select('*', { count: 'exact', head: true }),
        supabase.from('ecommerce_products').select('*', { count: 'exact', head: true })
      ]);

      setStats({
        services: servicesResult.count || 0,
        projects: projectsResult.count || 0,
        caseStudies: caseStudiesResult.count || 0,
        teamMembers: teamResult.count || 0,
        images: imagesResult.count || 0,
        products: productsResult.count || 0
      });

      // Mock recent activity for now
      setRecentActivity([
        {
          id: 1,
          type: 'service',
          action: 'created',
          title: 'New Web Development Service',
          time: '2 hours ago',
          icon: Plus
        },
        {
          id: 2,
          type: 'project',
          action: 'updated',
          title: 'E-commerce Platform Project',
          time: '4 hours ago',
          icon: Edit
        },
        {
          id: 3,
          type: 'team',
          action: 'added',
          title: 'New Team Member: John Doe',
          time: '1 day ago',
          icon: Users
        },
        {
          id: 4,
          type: 'case_study',
          action: 'published',
          title: 'Client Success Story',
          time: '2 days ago',
          icon: CheckCircle
        }
      ]);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Services',
      value: stats.services,
      icon: FileText,
      color: 'bg-blue-500',
      link: '/admin/services',
      change: '+12%'
    },
    {
      title: 'Projects',
      value: stats.projects,
      icon: FileText,
      color: 'bg-green-500',
      link: '/admin/projects',
      change: '+8%'
    },
    {
      title: 'Case Studies',
      value: stats.caseStudies,
      icon: FileText,
      color: 'bg-purple-500',
      link: '/admin/case-studies',
      change: '+15%'
    },
    {
      title: 'Team Members',
      value: stats.teamMembers,
      icon: Users,
      color: 'bg-orange-500',
      link: '/admin/team',
      change: '+5%'
    },
    {
      title: 'Images',
      value: stats.images,
      icon: Image,
      color: 'bg-pink-500',
      link: '/admin/images',
      change: '+20%'
    },
    {
      title: 'Products',
      value: stats.products,
      icon: ShoppingCart,
      color: 'bg-indigo-500',
      link: '/admin/products',
      change: '+10%'
    }
  ];

  const quickActions = [
    {
      title: 'Add New Service',
      description: 'Create a new service offering',
      icon: Plus,
      link: '/admin/services/new',
      color: 'bg-blue-500'
    },
    {
      title: 'Add Project',
      description: 'Showcase a new project',
      icon: Plus,
      link: '/admin/projects/new',
      color: 'bg-green-500'
    },
    {
      title: 'Upload Images',
      description: 'Add new media files',
      icon: Image,
      link: '/admin/images/upload',
      color: 'bg-purple-500'
    },
    {
      title: 'SEO Settings',
      description: 'Optimize site settings',
      icon: TrendingUp,
      link: '/admin/seo',
      color: 'bg-orange-500'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2">Welcome to HostWP Admin</h1>
        <p className="text-primary-100">
          Manage your website content, monitor performance, and grow your business.
        </p>
        <div className="mt-4 flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {new Date().toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={stat.link}>
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                        <span className="text-sm text-gray-500 ml-1">vs last month</span>
                      </div>
                    </div>
                    <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.title}
                    to={action.link}
                    className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors group"
                  >
                    <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{action.title}</h3>
                      <p className="text-sm text-gray-500">{action.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4 mr-1" />
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium capitalize">{activity.action}</span> {activity.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Performance Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Activity className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">98%</p>
              <p className="text-sm text-gray-600">Uptime</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">2.3s</p>
              <p className="text-sm text-gray-600">Load Time</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Eye className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">12.5K</p>
              <p className="text-sm text-gray-600">Page Views</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Users className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-orange-600">1.2K</p>
              <p className="text-sm text-gray-600">Visitors</p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminDashboard; 