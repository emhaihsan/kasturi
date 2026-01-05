'use client';

import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Andi Pratama',
    role: 'Mahasiswa di Banjarmasin',
    content: 'Kasturi membantu saya cepat beradaptasi saat kuliah di Banjarmasin. Sekarang saya bisa ngobrol lancar dengan teman-teman lokal!',
    rating: 5,
  },
  {
    id: 2,
    name: 'Siti Rahayu',
    role: 'Pekerja di Ambon',
    content: 'Belajar Bahasa Ambon jadi menyenangkan. Modul-modulnya praktis dan langsung bisa dipraktekkan.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Budi Santoso',
    role: 'Pengusaha',
    content: 'Sertifikat dari Kasturi membuktikan keseriusan saya belajar bahasa daerah. Partner bisnis lokal jadi lebih percaya.',
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-emerald-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Apa Kata Mereka?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Cerita sukses dari para learner yang sudah merasakan manfaat Kasturi
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <Quote className="w-10 h-10 text-emerald-200 mb-4" />
              <p className="text-gray-700 mb-6 leading-relaxed">{testimonial.content}</p>
              
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
