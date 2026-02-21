import { Outlet, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import LogoImage from "../assets/Images/Logo_Image.png";
import { 
  Home, 
  BookOpen, 
  PlusCircle, 
  MessageCircle, 
  Users,
  Sparkles
} from "lucide-react";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/courses", icon: BookOpen, label: "My Courses" },
  { path: "/create", icon: PlusCircle, label: "Create Course" },
  { path: "/interview", icon: Users, label: "Mock Interview" },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-card/50 backdrop-blur-xl border-r border-white/10 z-40 hidden lg:block">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2">
            <img src={LogoImage} alt="Cerebro Logo" className="w-10 h-10 rounded-xl" />
            <span className="text-xl font-bold font-['Outfit'] tracking-tight">Cerebro</span>
          </Link>
        </div>
        
        <nav className="px-3 mt-6">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                data-testid={`nav-${item.label.toLowerCase().replace(/\s/g, '-')}`}
                className={`nav-item flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all ${
                  isActive 
                    ? 'bg-primary/10 text-primary active' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        
        {/* Stats Card */}
        <div className="absolute bottom-6 left-3 right-3">
          <div className="glass-card rounded-2xl p-4">
            <p className="text-sm text-muted-foreground mb-2">Keep Learning!</p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Daily Goal</p>
                <p className="text-sm font-semibold">30 min</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-card/80 backdrop-blur-xl border-b border-white/10 z-40 lg:hidden">
        <div className="flex items-center justify-between h-full px-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={LogoImage} alt="Cerebro Logo" className="w-8 h-8 rounded-lg" />
            <span className="text-lg font-bold font-['Outfit']">Cerebro</span>
          </Link>
          
          <nav className="flex items-center gap-1">
            {navItems.slice(0, 4).map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`p-2 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-muted-foreground'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 mt-16 lg:mt-0">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4 lg:p-8"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}
