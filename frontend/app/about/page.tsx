import { Target, Users, Award, Heart, Globe, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">Tentang Kasturi</h1>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
            Platform pembelajaran bahasa daerah Indonesia dengan sertifikasi on-chain terverifikasi
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Masalah yang Kami Selesaikan</h2>
          <div className="prose prose-lg text-gray-600 max-w-none">
            <p>
              Indonesia memiliki ratusan bahasa daerah yang masih aktif digunakan dalam kehidupan sehari-hari. 
              Namun, tidak ada cara yang terstruktur dan kredibel bagi pendatang untuk mempelajarinya.
            </p>
            <p>
              Bagi <strong>perantau</strong>—mahasiswa, pekerja, atau keluarga yang pindah antar daerah—hambatan 
              bahasa sering menyebabkan miskomunikasi, gesekan sosial, dan kesulitan berintegrasi dengan komunitas lokal.
            </p>
            <p>
              Saat ini, belajar bahasa daerah bergantung pada keberuntungan: punya teman lokal yang mau mengajar, 
              tinggal cukup lama di daerah tersebut, atau trial-and-error yang berisiko secara sosial.
            </p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Solusi Kasturi</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Pembelajaran Terstruktur</h3>
                <p className="text-gray-600">
                  Modul-modul yang disusun sistematis berdasarkan percakapan kehidupan nyata, bukan teori grammar.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Sertifikat Terverifikasi</h3>
                <p className="text-gray-600">
                  Bukti penyelesaian program tercatat on-chain dan dapat diverifikasi siapapun tanpa perlu login.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Fokus pada Praktik</h3>
                <p className="text-gray-600">
                  Belajar bahasa yang benar-benar digunakan sehari-hari, bukan bahasa formal yang jarang dipakai.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Reward System</h3>
                <p className="text-gray-600">
                  Kumpulkan EXP dari setiap pelajaran, tukar menjadi token, dan dapatkan voucher atau merchandise.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Mengapa Blockchain?</h2>
          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center flex-shrink-0">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Kredibilitas Tanpa Perantara</h3>
                  <p className="text-gray-600">
                    Tanpa blockchain, sertifikat hanya bergantung pada kepercayaan terhadap platform. 
                    Dengan blockchain, bukti penyelesaian bersifat publik, permanen, dan dapat diverifikasi 
                    oleh siapapun tanpa perlu mempercayai Kasturi sebagai pihak ketiga.
                  </p>
                </div>
              </div>
              
              <div className="grid sm:grid-cols-3 gap-4 mt-6">
                <div className="bg-white rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-emerald-600">100%</p>
                  <p className="text-sm text-gray-500">Terverifikasi</p>
                </div>
                <div className="bg-white rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-emerald-600">0</p>
                  <p className="text-sm text-gray-500">Trust Required</p>
                </div>
                <div className="bg-white rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-emerald-600">∞</p>
                  <p className="text-sm text-gray-500">Durasi Bukti</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Dibangun untuk Lisk</h2>
          <div className="prose prose-lg text-gray-600 max-w-none">
            <p>
              Kasturi dibangun di atas <strong>Lisk</strong>, sebuah Ethereum Layer-2 yang dirancang untuk 
              biaya transaksi rendah, builder-friendly, dan fokus pada high-growth markets termasuk Asia Tenggara.
            </p>
            <p>
              Proyek ini dikembangkan sebagai submission untuk <strong>Lisk Builders Challenge Round 3</strong>, 
              hackathon online yang menekankan pembangunan <em>real venture</em>, bukan sekadar demo teknis.
            </p>
          </div>
        </section>

        <section className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full text-amber-700 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Siap untuk memulai?
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Mulai Belajar Sekarang</h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Pilih bahasa daerah dan mulai perjalanan belajar Anda. Gratis, terstruktur, dan bukti belajar Anda akan tersimpan selamanya.
          </p>
          <Link href="/languages">
            <Button size="lg">
              Pilih Bahasa
            </Button>
          </Link>
        </section>
      </div>
    </div>
  );
}
