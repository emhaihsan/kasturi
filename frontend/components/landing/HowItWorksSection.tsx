'use client';

import { UserPlus, BookOpen, Award, Gift } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    step: '01',
    title: 'Daftar Gratis',
    description: 'Login dengan email, Google, Twitter, atau wallet. Tidak perlu pengalaman crypto.',
  },
  {
    icon: BookOpen,
    step: '02',
    title: 'Pilih & Belajar',
    description: 'Pilih bahasa daerah dan mulai belajar melalui modul-modul terstruktur.',
  },
  {
    icon: Award,
    step: '03',
    title: 'Dapatkan Sertifikat',
    description: 'Selesaikan program dan terima sertifikat on-chain yang dapat diverifikasi.',
  },
  {
    icon: Gift,
    step: '04',
    title: 'Tukar Reward',
    description: 'Kumpulkan EXP, tukar ke token, dan redeem voucher atau merchandise.',
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Cara Kerja Kasturi
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Empat langkah sederhana menuju kemampuan bahasa daerah yang terverifikasi
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-emerald-300 to-transparent -translate-x-4" />
                )}
                <div className="text-center">
                  <div className="relative inline-flex">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/25">
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center text-amber-900 font-bold text-sm">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
