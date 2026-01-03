import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Calculator,
  PieChart,
  Lightbulb,
  Target,
  FileText,
  BookOpen,
  MessageCircle,
  Settings,
  HelpCircle,
  Menu,
  X,
  Leaf,
  ChevronLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Calculator, label: 'Carbon Calculator', path: '/calculator' },
  { icon: PieChart, label: 'Emissions Breakdown', path: '/emissions' },
  { icon: Lightbulb, label: 'Recommendations', path: '/recommendations' },
  { icon: Target, label: 'Goals & Progress', path: '/goals' },
  { icon: FileText, label: 'Reports', path: '/reports' },
  { icon: BookOpen, label: 'Learn', path: '/learn' },
  { icon: MessageCircle, label: 'Eco Assistant', path: '/assistant' },
  { icon: Settings, label: 'Settings', path: '/settings' },
  { icon: HelpCircle, label: 'Help & Support', path: '/help' },
];

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  isCollapsed: boolean;
  onCollapse: () => void;
}

export function Sidebar({ isOpen, onToggle, isCollapsed, onCollapse }: SidebarProps) {
  const location = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full bg-sidebar z-50 transition-all duration-300 ease-in-out flex flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0',
          isCollapsed ? 'lg:w-20' : 'lg:w-64',
          'w-64'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <div className={cn(
            'flex items-center gap-3 transition-opacity duration-200',
            isCollapsed && 'lg:opacity-0 lg:invisible'
          )}>
            <div className="w-10 h-10 rounded-xl gradient-emerald flex items-center justify-center shadow-glow">
              <Leaf className="w-6 h-6 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-sidebar-foreground text-lg">EcoTrack</h1>
              <p className="text-xs text-sidebar-muted-foreground">Carbon Footprint</p>
            </div>
          </div>
          
          {/* Mobile Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="lg:hidden text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <X className="w-5 h-5" />
          </Button>

          {/* Desktop Collapse Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onCollapse}
            className={cn(
              'hidden lg:flex text-sidebar-foreground hover:bg-sidebar-accent transition-transform duration-200',
              isCollapsed && 'rotate-180'
            )}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </div>

        {/* Collapsed Logo */}
        {isCollapsed && (
          <div className="hidden lg:flex justify-center py-4 border-b border-sidebar-border">
            <div className="w-10 h-10 rounded-xl gradient-emerald flex items-center justify-center shadow-glow">
              <Leaf className="w-6 h-6 text-sidebar-primary-foreground" />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={() => {
                      if (window.innerWidth < 1024) onToggle();
                    }}
                    className={cn(
                      'sidebar-item',
                      isActive && 'sidebar-item-active',
                      isCollapsed && 'lg:justify-center lg:px-0'
                    )}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <item.icon className={cn(
                      'w-5 h-5 flex-shrink-0',
                      isActive ? 'text-sidebar-primary-foreground' : 'text-sidebar-foreground/70'
                    )} />
                    <span className={cn(
                      'font-medium transition-opacity duration-200',
                      isCollapsed && 'lg:hidden'
                    )}>
                      {item.label}
                    </span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className={cn(
          'p-4 border-t border-sidebar-border',
          isCollapsed && 'lg:px-2'
        )}>
          <div className={cn(
            'bg-sidebar-accent rounded-xl p-4 text-center',
            isCollapsed && 'lg:p-2'
          )}>
            <p className={cn(
              'text-xs text-sidebar-muted-foreground mb-2',
              isCollapsed && 'lg:hidden'
            )}>
              🌱 Every action counts
            </p>
            <p className={cn(
              'text-sm font-medium text-sidebar-foreground',
              isCollapsed && 'lg:hidden'
            )}>
              -2.5 tons CO₂ this year
            </p>
            {isCollapsed && (
              <span className="hidden lg:block text-xl">🌱</span>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
