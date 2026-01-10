'use client';

import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <img src="/icon.webp" alt="Kasturi" className="w-8 h-8" />
              <span className="text-lg font-bold text-neutral-900">Kasturi</span>
            </Link>
            <p className="text-sm text-neutral-500">
              Learn Indonesian regional languages with on-chain credentials and real-world rewards.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-neutral-900 mb-4 text-sm">Platform</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/languages" className="text-neutral-500 hover:text-neutral-900 transition-colors">
                  Languages
                </Link>
              </li>
              <li>
                <Link href="/rewards" className="text-neutral-500 hover:text-neutral-900 transition-colors">
                  Rewards
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-neutral-500 hover:text-neutral-900 transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* <div>
            <h3 className="font-medium text-neutral-900 mb-4 text-sm">Resources</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/wallet" className="text-neutral-500 hover:text-neutral-900 transition-colors">
                  Wallet
                </Link>
              </li>
              <li>
                <a 
                  href="https://sepolia-blockscout.lisk.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                  Block Explorer
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div> */}

          {/* <div>
            <h3 className="font-medium text-neutral-900 mb-4 text-sm">Powered By</h3>
            <a 
              href="https://lisk.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
            >
              <Image 
                src="/lisklogo.png" 
                alt="Lisk" 
                width={24} 
                height={24}
                className="w-6 h-6"
              />
              <span className="text-sm font-medium text-neutral-700">Lisk</span>
            </a>
            <p className="text-xs text-neutral-400 mt-3">
              Built on Lisk L2 for fast, low-cost transactions
            </p>
          </div> */}
        </div>

        <div className="border-t border-neutral-200 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <p className="text-neutral-500 text-sm">
              © 2026 Kasturi
            </p>
            <span className="text-neutral-300">•</span>
            <a 
              href="https://lisk.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-700 text-sm transition-colors"
            >
              <Image 
                src="/lisklogo.png" 
                alt="Lisk" 
                width={16} 
                height={16}
                className="w-4 h-4"
              />
              Powered by Lisk
            </a>
          </div>
          <p className="text-sm text-neutral-500">
            Lisk Builders Challenge Round 3
          </p>
        </div>
      </div>
    </footer>
  );
}
