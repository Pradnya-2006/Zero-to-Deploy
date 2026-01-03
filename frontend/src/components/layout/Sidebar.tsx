import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
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
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
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
  const [collapsed, setCollapsed] = useState(isCollapsed);
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('auth');
      sessionStorage.removeItem('token');
    } catch (e) {
      // ignore
    }
    navigate('/auth?mode=login');
    // reload to clear any in-memory UI state tied to the previous user
    setTimeout(() => window.location.reload(), 50);
  };

  useEffect(() => {
    setCollapsed(isCollapsed);
  }, [isCollapsed]);

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
          collapsed ? 'lg:w-20' : 'lg:w-64',
          'w-64'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <div className={cn(
            'flex items-center gap-3 transition-opacity duration-200',
            collapsed && 'lg:opacity-0 lg:invisible'
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
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </Button>


          <button
            onClick={() => {
              setCollapsed((s) => !s);
              onCollapse();
            }}
            className={cn(
              'hidden lg:flex items-center justify-center',
              'absolute -right-3 top-6 z-50',
              'h-8 w-8 rounded-full bg-sidebar border border-sidebar-border shadow-md',
              'hover:bg-sidebar-accent transition-transform',
              collapsed && 'rotate-180'
            )}
            aria-label="Toggle sidebar collapse"
          >
            <ChevronLeft className="w-4 h-4 text-sidebar-foreground" />
          </button>

        </div>

        {/* Collapsed Logo */}
        {collapsed && (
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
                      collapsed && 'lg:justify-center lg:px-0'
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon className={cn(
                      'w-5 h-5 flex-shrink-0',
                      isActive ? 'text-sidebar-primary-foreground' : 'text-sidebar-foreground/70'
                    )} />
                    <span className={cn(
                      'font-medium transition-opacity duration-200',
                      collapsed && 'lg:hidden'
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
          collapsed && 'lg:px-2'
        )}>
          <div className={cn(
            'bg-sidebar-accent rounded-xl p-4 text-center',
            collapsed && 'lg:p-2'
          )}>
            <p className={cn(
              'text-xs text-sidebar-muted-foreground mb-2',
              collapsed && 'lg:hidden'
            )}>
              🌱 Every action counts
            </p>
            <p className={cn(
              'text-sm font-medium text-sidebar-foreground',
              collapsed && 'lg:hidden'
            )}>
              -2.5 tons CO₂ this year
            </p>
            {collapsed && (
              <span className="hidden lg:block text-xl">🌱</span>
            )}
          </div>

          <div className={cn(
            'mt-3'
          )}>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className={cn(
                'w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent',
                collapsed && 'lg:justify-center'
              )}
            >
              <LogOut className="w-5 h-5" />
              <span className={cn('font-medium', collapsed && 'lg:hidden')}>Logout</span>
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
