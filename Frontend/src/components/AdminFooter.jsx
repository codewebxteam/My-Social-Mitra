import React from "react";
import { Heart } from "lucide-react";

const AdminFooter = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 py-6 mb-16 md:mb-0">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-500 font-medium">
          © {new Date().getFullYear()} Alife Stable Admin. Internal Use Only.
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span>Secure Panel</span>
          <div className="w-1 h-1 bg-slate-300 rounded-full" />
          <span>v2.4.0</span>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;
