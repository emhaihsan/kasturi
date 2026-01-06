'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="text-lg font-bold text-neutral-900 mb-4 block">
              Kasturi
            </Link>
            <p className="text-sm text-neutral-500">
              Platform pembelajaran bahasa daerah Indonesia dengan sertifikasi on-chain.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-neutral-900 mb-4 text-sm">Platform</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/languages" className="text-neutral-500 hover:text-neutral-900 transition-colors">
                  Bahasa
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-neutral-500 hover:text-neutral-900 transition-colors">
                  Tentang
                </Link>
              </li>
              <li>
                <Link href="/verify" className="text-neutral-500 hover:text-neutral-900 transition-colors">
                  Verifikasi
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-neutral-900 mb-4 text-sm">Bantuan</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/faq" className="text-neutral-500 hover:text-neutral-900 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-neutral-500 hover:text-neutral-900 transition-colors">
                  Kontak
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-neutral-500 hover:text-neutral-900 transition-colors">
                  Privasi
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-neutral-900 mb-4 text-sm">Kontak</h3>
            <ul className="space-y-3 text-sm text-neutral-500">
              <li>hello@kasturi.id</li>
              <li>Twitter @kasturi</li>
              <li>GitHub</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-200 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-neutral-500 text-sm">
            © 2026 Kasturi. Built on Lisk.
          </p>
          <p className="text-sm text-neutral-500">
            Lisk Builders Challenge Round 3
          </p>
        </div>
      </div>
    </footer>
  );
}
