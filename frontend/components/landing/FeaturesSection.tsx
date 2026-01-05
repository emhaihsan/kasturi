'use client';

import { BookOpen, Video, Award, Gift, Users, Shield } from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    title: 'Pembelajaran Terstruktur',
    description: 'Modul-modul yang disusun sistematis dari dasar hingga mahir, dengan fokus pada percakapan sehari-hari.',
    color: 'emerald',
  },
  {
    icon: Video,
    title: 'Video Interaktif',
    description: 'Belajar dari native speaker melalui video percakapan real-life yang mudah dipahami.',
    color: 'blue',
  },
  {
    icon: Award,
    title: 'Sertifikat Terverifikasi',
    description: 'Dapatkan credential on-chain yang dapat diverifikasi siapapun sebagai bukti pembelajaran.',
    color: 'amber',
  },
  {
    icon: Gift,
    title: 'Reward & Voucher',
    description: 'Kumpulkan EXP, tukarkan ke token, dan dapatkan voucher eksklusif untuk mentoring atau merchandise.',
    color: 'pink',
  },
  {
    icon: Users,
    title: 'Komunitas Learner',
    description: 'Bergabung dengan komunitas pelajar bahasa daerah dari seluruh Indonesia.',
    color: 'purple',
  },
  {
    icon: Shield,
    title: 'Privasi Terjaga',
    description: 'Login mudah dengan email atau social media. Blockchain bekerja di balik layar.',
    color: 'teal',
  },
];

const colorClasses: Record<string, { bg: string; icon: string; border: string }> = {
  emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', border: 'border-emerald-100' },
  blue: { bg: 'bg-blue-50', icon: 'text-blue-600', border: 'border-blue-100' },
  amber: { bg: 'bg-amber-50', icon: 'text-amber-600', border: 'border-amber-100' },
  pink: { bg: 'bg-pink-50', icon: 'text-pink-600', border: 'border-pink-100' },
  purple: { bg: 'bg-purple-50', icon: 'text-purple-600', border: 'border-purple-100' },
  teal: { bg: 'bg-teal-50', icon: 'text-teal-600', border: 'border-teal-100' },
};

export function FeaturesSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Kenapa Belajar di{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              Kasturi
            </span>
            ?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Platform pembelajaran bahasa daerah yang terstruktur, praktis, dan memberikan bukti nyata.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const colors = colorClasses[feature.color];
            
            return (
              <div
                key={index}
                className={`group p-6 rounded-2xl border ${colors.border} ${colors.bg} hover:shadow-lg transition-all duration-300`}
              >
                <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${colors.icon}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
