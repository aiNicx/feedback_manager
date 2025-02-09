'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { useState, useEffect } from 'react'

interface NavigationItem {
  name: string
  href: string
  subtitle?: string
}

const navigationLeft: NavigationItem[] = [
  { name: 'Clusters', href: '/admin/clusters' },
  { name: 'Teams', href: '/admin/teams' },
  { name: 'Users', href: '/admin/users' },
  { name: 'Levels', href: '/admin/levels' },
  { name: 'Processes', href: '/admin/processes' },
]

const navigationRight: NavigationItem[] = [
  { name: 'Questions', href: '/admin/questions' },
  { name: 'Rules', href: '/admin/rules' },
  { name: 'Sessions', href: '/admin/sessions' },
  { name: 'Feedbacks', href: '/admin/feedbacks', subtitle: '(Analisi Sessione)' },
]

export const AdminHeader = () => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  const NavLink = ({ item }: { item: NavigationItem }) => (
    <Link
      key={item.name}
      href={item.href}
      className={cn(
        pathname === item.href
          ? 'text-blue-600'
          : 'text-gray-500 hover:text-gray-700',
        'text-base font-medium transition-colors',
        isMobile ? 'block py-2' : ''
      )}
      onClick={() => setIsOpen(false)}
    >
      {item.name}
      {item.subtitle && (
        <span className="ml-1 text-gray-400">{item.subtitle}</span>
      )}
    </Link>
  )

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b shadow-sm">
      <nav className="mx-auto flex max-w-full items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        {isMobile ? (
          <>
            <div className="flex-1" />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-8 w-8" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetTitle className="text-xl font-bold text-gray-900 mb-6">
                  Admin Menu
                </SheetTitle>
                <div className="flex flex-col space-y-6 mt-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Gestione Team
                    </h3>
                    {navigationLeft.map((item) => (
                      <NavLink key={item.name} item={item} />
                    ))}
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Gestione Feedback
                    </h3>
                    {navigationRight.map((item) => (
                      <NavLink key={item.name} item={item} />
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </>
        ) : (
          <>
            <div className="flex items-center space-x-8">
              {navigationLeft.map((item) => (
                <NavLink key={item.name} item={item} />
              ))}
            </div>
            <div className="flex items-center space-x-8">
              {navigationRight.map((item) => (
                <NavLink key={item.name} item={item} />
              ))}
            </div>
          </>
        )}
      </nav>
    </header>
  )
}
