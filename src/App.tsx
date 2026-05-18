import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Tasks from "@/pages/Tasks";
import Reports from "@/pages/Reports";
import BottomNav from "@/components/BottomNav";
import InstallPrompt from "@/components/InstallPrompt";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-[#FFF5F5] via-[#FFF8F0] to-[#FFF5F5]">
        <div className="max-w-lg mx-auto px-5 pt-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </div>
        <BottomNav />
        <InstallPrompt />
      </div>
    </Router>
  );
}
