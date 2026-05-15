import { NavLink, useLocation } from 'react-router-dom';
import { CheckSquare, ListChecks, BarChart3 } from 'lucide-react';

const tabs = [
  { to: '/', icon: CheckSquare, label: '今日' },
  { to: '/tasks', icon: ListChecks, label: '任务' },
  { to: '/reports', icon: BarChart3, label: '报表' },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-t border-pink-100 safe-area-bottom">
      <div className="max-w-lg mx-auto flex justify-around items-center h-16 px-4">
        {tabs.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          return (
            <NavLink
              key={to}
              to={to}
              className={`flex flex-col items-center gap-0.5 transition-all duration-200 ${
                active ? 'text-pink-400 scale-110' : 'text-gray-300 hover:text-pink-300'
              }`}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 2} />
              <span className="text-xs font-medium">{label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}