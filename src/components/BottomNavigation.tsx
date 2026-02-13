'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Timer', icon: 'bi-clock' },
  { href: '/activities', label: 'Activities', icon: 'bi-list-task' },
  { href: '/ai', label: 'AI', icon: 'bi-lightbulb' },
];

export const BottomNavigation: React.FC = () => {
  const pathname = usePathname();
  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname?.startsWith(href);

  return (
    <nav className="bottom-navigation d-lg-none" aria-label="Bottom navigation">
      <div className="bottom-nav-container">
        {navItems.map(item => (
          <Link 
            key={item.href} 
            href={item.href} 
            className={`bottom-nav-item ${isActive(item.href) ? 'active' : ''}`}
            aria-current={isActive(item.href) ? 'page' : undefined}
          >
            <i className={`${item.icon} bottom-nav-icon`} aria-hidden="true"></i>
            <span className="bottom-nav-label">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};
