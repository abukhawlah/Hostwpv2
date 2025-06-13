import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FileText,
  Settings,
  Globe,
  TrendingUp,
  Eye,
  Plus,
  Edit,
  Activity,
  Calendar,
  Clock,
  CheckCircle,
  Home,
  Server,
  Palette
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Card from '../ui/Card';
import Button from '../ui/Button';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    websiteSections: 0,
    hostingPlans: 0,
    features: 0,
    seoSettings: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch counts for website content entities
      const [
        sectionsResult,
        plansResult,
        featuresResult,
        seoResult
      ] = await Promise.all([
        supabase.from('website_sections').select('*', { count: 'exact', head: true }),
        supabase.from('hosting_plans').select('*', { count: 'exact', head: true }),
        supabase.from('website_features').select('*', { count: 'exact', head: true }),
        supabase.from('seo_settings').select('*', { count: 'exact', head: true })
      ]);

      setStats({
        websiteSections: sectionsResult.count || 0,
        hostingPlans: plansResult.count || 0,
        features: featuresResult.count || 0,
        seoSettings: seoResult.count || 0
      });

      // Mock recent activity for website content management
      setRecentActivity([
        {
          id: 1,
          type: 'content',
          action: 'updated',
          title: 'Home Hero Section Updated',
          time: '2 hours ago',
          icon: Home
        },
        {
          id: 2,
          type: 'plan',
          action: 'created',
          title: 'New Hosting Plan: Pro',
          time: '4 hours ago',
          icon: Server
        },
        {
          id: 3,
          type: 'feature',
          action: 'updated',
          title: 'Security Feature Description',
          time: '1 day ago',
          icon: CheckCircle
        },
        {
          id: 4,
          type: 'seo',
          action: 'configured',
          title: 'SEO Meta Tags Updated',
          time: '2 days ago',
          icon: TrendingUp
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
      title: 'Website Sections',
      value: stats.websiteSections,
      icon: FileText,
      color: 'bg-blue-500',
      link: '/admin/content',
      change: '+12%',
      description: 'Page content sections'
    },
    {
      title: 'Hosting Plans',
      value: stats.hostingPlans,
      icon: Server,
      color: 'bg-green-500',
      link: '/admin/hosting-plans',
      change: '+8%',
      description: 'Available hosting packages'
    },
    {
      title: 'Website Features',
      value: stats.features,
      icon: CheckCircle,
      color: 'bg-purple-500',
      link: '/admin/features',
      change: '+15%',
      description: 'Feature highlights'
    },
    {
      title: 'SEO Settings',
      value: stats.seoSettings,
      icon: TrendingUp,
      color: 'bg-orange-500',
      link: '/admin/seo',
      change: '+5%',
      description: 'Search optimization'
    }
  ];

  const quickActions = [
    {
      title: 'Edit Home Page',
      description: 'Update homepage content',
      icon: Home,
      link: '/admin/content?section=home',
      color: 'bg-blue-500'
    },
    {
      title: 'Manage Plans',
      description: 'Add or edit hosting plans',
      icon: Server,
      link: '/admin/hosting-plans',
      color: 'bg-green-500'
    },
    {
      title: 'Update Features',
      description: 'Modify feature highlights',
      icon: CheckCircle,
      link: '/admin/features',
      color: 'bg-purple-500'
    },
    {
      title: 'SEO Settings',
      description: 'Optimize search presence',
      icon: TrendingUp,
      link: '/admin/seo',
      color: 'bg-orange-500'
    },
    {
      title: 'Site Settings',
      description: 'Manage favicon and general settings',
      icon: Settings,
      link: '/admin/settings',
      color: 'bg-gray-500'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Website Dashboard</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Website Dashboard</h1>
          <p className="text-gray-600">Manage your HostWP website content</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <Button
            as={Link}
            to="/"
            target="_blank"
            variant="outline"
            className="flex items-center"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Website
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <Link to={stat.link} className="block">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-green-600">{stat.change}</span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                  <p className="text-sm font-medium text-gray-900">{stat.title}</p>
                  <p className="text-xs text-gray-500">{stat.description}</p>
                </div>
              </Link>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={action.link}
                  className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-primary-200 hover:bg-primary-50 transition-colors group"
                >
                  <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{action.title}</h3>
                    <p className="text-sm text-gray-500">{action.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-3"
              >
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <activity.icon className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* Content Overview */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Content Overview</h2>
        <div className="prose prose-sm text-gray-600">
          <p>
            Your website content is managed through this dashboard. You can edit page sections, 
            update hosting plans, modify features, and optimize SEO settings. All changes will 
            be reflected on your live website immediately.
          </p>
        </div>
        <div className="mt-4 flex space-x-3">
          <Button as={Link} to="/admin/content" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Edit Content
          </Button>
          <Button as={Link} to="/admin/hosting-plans" variant="outline" size="sm">
            <Server className="w-4 h-4 mr-2" />
            Manage Plans
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard; 