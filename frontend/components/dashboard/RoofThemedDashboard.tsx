'use client';

import { motion } from 'framer-motion';
import { BarChart, TrendingUp, Users, AlertCircle, Roof, CheckCircle, Clock, DollarSign, FileText } from 'lucide-react';

interface MetricCard {
  id: string;
  label: string;
  value: string | number;
  change: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface RoofThemedDashboardProps {
  userName?: string;
}

const metrics: MetricCard[] = [
  {
    id: '1',
    label: 'Active Jobs',
    value: '12',
    change: 8,
    icon: Roof,
    color: 'from-amber-400 to-orange-500',
  },
  {
    id: '2',
    label: 'Revenue This Month',
    value: '₵45,320',
    change: 15,
    icon: DollarSign,
    color: 'from-emerald-400 to-teal-500',
  },
  {
    id: '3',
    label: 'Pending Estimates',
    value: '8',
    change: -5,
    icon: FileText,
    color: 'from-purple-400 to-indigo-500',
  },
  {
    id: '4',
    label: 'Team Members',
    value: '6',
    change: 1,
    icon: Users,
    color: 'from-blue-400 to-cyan-500',
  },
];

const recentJobs = [
  {
    id: 1,
    name: 'Residential Tile Replacement - East Legon',
    status: 'In Progress',
    progress: 75,
    team: 4,
    amount: '₵8,500',
    statusColor: 'bg-amber-500/20 text-amber-300',
  },
  {
    id: 2,
    name: 'Commercial Roof Installation - Osu',
    status: 'Completed',
    progress: 100,
    team: 5,
    amount: '₵22,000',
    statusColor: 'bg-emerald-500/20 text-emerald-300',
  },
  {
    id: 3,
    name: 'Roof Inspection & Repair - Airport Residential',
    status: 'Scheduled',
    progress: 0,
    team: 3,
    amount: '₵6,800',
    statusColor: 'bg-blue-500/20 text-blue-300',
  },
];

export default function RoofThemedDashboard({ userName = 'User' }: RoofThemedDashboardProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-bold text-white mb-2">Welcome back, {userName}</h1>
        <p className="text-white/60 flex items-center gap-2">
          <Roof className="h-5 w-5 text-amber-400" />
          Your RoofManager Dashboard
        </p>
      </motion.div>

      {/* Metrics Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {metrics.map((metric) => (
          <motion.div
            key={metric.id}
            variants={itemVariants}
            className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:translate-y-[-4px]"
          >
            {/* Background with glass effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent glass-light backdrop-blur-lg border border-white/20 group-hover:border-amber-400/30 transition-all" />

            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${metric.color} text-white shadow-lg`}>
                  <metric.icon className="h-6 w-6" />
                </div>
                <motion.div
                  className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                    metric.change >= 0
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-red-500/20 text-red-300'
                  }`}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <TrendingUp className={`h-4 w-4 ${metric.change < 0 ? 'rotate-180' : ''}`} />
                  <span className="text-xs font-semibold">{Math.abs(metric.change)}%</span>
                </motion.div>
              </div>

              <p className="text-white/60 text-sm font-medium mb-2">{metric.label}</p>
              <p className="text-3xl font-bold text-white">{metric.value}</p>
            </div>

            {/* Bottom accent line */}
            <motion.div
              className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${metric.color}`}
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Jobs - Main section */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="rounded-2xl p-8 glass-medium border border-white/10 backdrop-blur-lg overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Roof className="h-6 w-6 text-amber-400" />
                Active Jobs
              </h2>
              <button className="text-sm text-amber-400 hover:text-amber-300 font-semibold transition-colors">
                View All
              </button>
            </div>

            <div className="space-y-4">
              {recentJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  className="group relative overflow-hidden rounded-xl p-4 bg-gradient-to-r from-white/5 to-transparent border border-white/10 hover:border-amber-400/20 transition-all"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ x: 4 }}
                >
                  {/* Content */}
                  <div className="relative z-10 flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-2">{job.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-white/60 mb-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${job.statusColor}`}>
                          {job.status}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {job.team} members
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${job.progress}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                        />
                      </div>
                    </div>

                    <div className="text-right ml-4">
                      <p className="font-bold text-white text-lg">{job.amount}</p>
                      <p className="text-sm text-white/60">{job.progress}%</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right sidebar - Quick stats and alerts */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {/* Quick Links */}
          <div className="rounded-2xl p-6 glass-medium border border-white/10 backdrop-blur-lg">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              {[
                { icon: '📋', label: 'New Estimate', color: 'from-amber-400 to-orange-500' },
                { icon: '👥', label: 'Assign Crew', color: 'from-blue-400 to-cyan-500' },
                { icon: '📸', label: 'Upload Photos', color: 'from-purple-400 to-indigo-500' },
              ].map((action, index) => (
                <motion.button
                  key={index}
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all text-left flex items-center gap-3"
                  whileHover={{ x: 4 }}
                >
                  <span className="text-xl">{action.icon}</span>
                  <span className="text-sm font-medium">{action.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Alerts */}
          <div className="rounded-2xl p-6 glass-medium border border-white/10 backdrop-blur-lg">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-400" />
              Alerts
            </h3>
            <div className="space-y-3">
              <motion.div
                className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <p className="text-sm text-amber-200">
                  <span className="font-semibold">1 pending estimate</span> waiting for client approval
                </p>
              </motion.div>
              <motion.div
                className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <p className="text-sm text-emerald-200">
                  <span className="font-semibold">Job completed</span> at Airport Residential
                </p>
              </motion.div>
            </div>
          </div>

          {/* Team Performance */}
          <div className="rounded-2xl p-6 glass-medium border border-white/10 backdrop-blur-lg">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-emerald-400" />
              Team Performance
            </h3>
            <div className="space-y-3">
              {[
                { name: 'Kwame', jobs: 8, color: 'from-amber-400 to-orange-500' },
                { name: 'Ama', jobs: 6, color: 'from-emerald-400 to-teal-500' },
                { name: 'David', jobs: 5, color: 'from-blue-400 to-cyan-500' },
              ].map((member, index) => (
                <motion.div key={index} className="flex items-center gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white mb-1">{member.name}</p>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${member.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${(member.jobs / 8) * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-white/70 w-8 text-right">{member.jobs}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
