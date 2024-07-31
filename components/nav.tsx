"use client"

import { useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'


const navigation = [
  { name: 'Accueil', href: '/' },
  { name: 'Clubs', href: '/clubs' },
  { name: 'Joueurs', href: '/players'}
]



export default function Example() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  return (
    <header className="">
      <nav className=" flex  items-center justify-between p-1 ml-2 lg:ml-20" aria-label="Global">
        <div className="flex items-center gap-x-12">
          <a href="/" className='-m-1.5 p-1.5'>
            <img className="h-24 w-32" src="ballon.png" alt="" />
          </a>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a key={item.name} href={item.href} className="text-sm font-semibold leading-6 hover:text-indigo-600">
                {item.name}
              </a>
            ))}
          </div>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6 mr-3" aria-hidden="true" />
          </button>
        </div>
        
      </nav>
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-slate-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img className="h-10 w-auto" src="spotify.webp" alt="" />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  )
}