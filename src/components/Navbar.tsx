import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Info, BarChart, UserPlus, Mail, Menu, X, LogOut, FileText } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import forexkingLogo from '@/assets/forexking-logo.png';

const navItems = [
  { label: 'Home', icon: Home, href: 'home' },
  { label: 'About Us', icon: Info, href: 'about' },
  { label: 'Deal Performance', icon: BarChart, href: 'performance', isRoute: true },
  { label: 'Open Account', icon: UserPlus, href: 'video-tutorial' },
  { label: 'Contact', icon: Mail, href: 'contact' },
  { label: 'Customer Agreement', icon: FileText, href: 'agreement', isRoute: true },
];

const Navbar = ({ onToggle }: { onToggle: (collapsed: boolean) => void }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const handleResize = useCallback(() => {
    const isMobileView = window.innerWidth <= 768;
    setIsMobile(isMobileView);
    if (isMobileView) onToggle(false);
    else onToggle(collapsed);
  }, [collapsed, onToggle]);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  const isActive = (href: string, isRoute?: boolean) => {
    if (isRoute) {
      return location.pathname === `/${href}`;
    }
    return location.hash === `#${href}` || location.pathname === `/${href}`;
  };

  const handleLogoClick = () => {
    if (collapsed && !isMobile) {
      setCollapsed(false);
      onToggle(false);
    }
  };

  // Mobile dropdown navbar
  if (isMobile) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <img src="/Assets/SymbolColored.svg" alt="Forex King" className="h-10 w-10" />
            <span className="text-xl font-bold text-foreground">Forex King</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-foreground hover:text-primary transition-colors"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-border bg-background/95 backdrop-blur-sm">
            <div className="px-6 py-4 space-y-4">
              {navItems.map(({ label, href, isRoute }) => {
                const active = isActive(href, isRoute);
                return isRoute ? (
                  <Link
                    key={href}
                    to={`/${href}`}
                    onClick={() => setMobileMenuOpen(false)}
                    aria-current={active ? 'page' : undefined}
                    className={`flex items-center gap-2 py-2 text-sm font-medium transition-colors ${
                      active
                        ? 'text-primary font-semibold'
                        : 'text-foreground hover:text-primary'
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full bg-primary transition-opacity ${active ? 'opacity-100' : 'opacity-0'}`} />
                    {label}
                  </Link>
                ) : (
                  <a
                    key={href}
                    href={`/#${href}`}
                    onClick={() => setMobileMenuOpen(false)}
                    aria-current={active ? 'page' : undefined}
                    className={`flex items-center gap-2 py-2 text-sm font-medium transition-colors ${
                      active
                        ? 'text-primary font-semibold'
                        : 'text-foreground hover:text-primary'
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full bg-primary transition-opacity ${active ? 'opacity-100' : 'opacity-0'}`} />
                    {label}
                  </a>
                );
              })}
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between mb-4">
                  <LanguageToggle />
                  <ThemeToggle />
                </div>
                <div className="space-y-3">
                  {user ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            Hello, {user.name}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={signOut}
                        className="w-full text-sm font-medium px-4 py-2.5 rounded-lg bg-destructive/20 hover:bg-destructive/30 text-destructive-foreground transition-colors flex items-center justify-center gap-2"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <>
                      <Link to="/signin">
                        <button className="w-full text-sm font-medium px-4 py-2.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
                          Sign In
                        </button>
                      </Link>
                      <Link to="/register">
                        <button className="w-full text-sm font-medium px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                          Register
                        </button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    );
  }

  // Desktop sidebar
  return (
    <aside
      className={`fixed top-0 left-0 h-full z-50 bg-background/95 backdrop-blur-sm border-r border-border shadow-lg transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-72'
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-6 h-24 border-b border-border">
          <Link to="/" className="flex items-center gap-4" onClick={handleLogoClick}>
            <img src="/Assets/SymbolColored.svg" alt="Forex King" className="h-10 w-10" />
            {!collapsed && (
              <span className="text-2xl font-bold tracking-wide text-foreground">
                Forex King
              </span>
            )}
          </Link>
          {!collapsed && (
            <button
              onClick={() => {
                setCollapsed(true);
                onToggle(true);
              }}
              className="p-2 text-foreground hover:text-primary transition-colors rounded-lg hover:bg-secondary"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <nav className="mt-8 flex flex-col gap-2 px-4 flex-grow">
          {navItems.map(({ label, icon: Icon, href, isRoute }) => {
            const active = isActive(href, isRoute);
            return isRoute ? (
              <Link
                key={href}
                to={`/${href}`}
                aria-current={active ? 'page' : undefined}
                className={`relative flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                  active
                    ? 'bg-primary/10 text-primary font-semibold shadow-sm'
                    : 'text-foreground hover:bg-secondary hover:text-primary'
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl bg-primary" />
                )}
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{label}</span>}
              </Link>
            ) : (
              <a
                key={href}
                href={`/#${href}`}
                aria-current={active ? 'page' : undefined}
                className={`relative flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                  active
                    ? 'bg-primary/10 text-primary font-semibold shadow-sm'
                    : 'text-foreground hover:bg-secondary hover:text-primary'
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl bg-primary" />
                )}
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{label}</span>}
              </a>
            );
          })}
        </nav>

        <div className="px-6 py-8 space-y-6 border-t border-border">
          <div className={`flex ${collapsed ? 'flex-col items-center gap-4' : 'justify-between items-center'}`}>
            <LanguageToggle />
            <ThemeToggle />
          </div>
          <div className="flex flex-col gap-3">
            {user ? (
              <div className="space-y-3">
                {!collapsed && (
                  <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        Hello, {user.name}
                      </p>
                    </div>
                  </div>
                )}
                <button
                  onClick={signOut}
                  className={`w-full text-sm font-medium px-4 py-2.5 rounded-xl bg-destructive/20 hover:bg-destructive/30 text-destructive-foreground transition-colors ${
                    collapsed ? 'flex justify-center' : 'flex items-center justify-center gap-2'
                  }`}
                >
                  {collapsed ? '🚪' : (
                    <>
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </>
                  )}
                </button>
              </div>
            ) : (
              <>
                <Link to="/signin">
                  <button
                    className={`w-full text-sm font-medium px-4 py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors ${
                      collapsed ? 'flex justify-center' : ''
                    }`}
                  >
                    {!collapsed ? 'Sign In' : '🔐'}
                  </button>
                </Link>
                <Link to="/register">
                  <button
                    className={`w-full text-sm font-medium px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm ${
                      collapsed ? 'flex justify-center' : ''
                    }`}
                  >
                    {!collapsed ? 'Register' : '✍️'}
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Navbar;
