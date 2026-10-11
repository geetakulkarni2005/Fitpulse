import {
  Activity,
  BarChart3,
  FileText,
  HelpCircle,
  LayoutDashboard,
  Lightbulb,
  Settings,
  Sliders,
  TrendingUp,
  Users,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const items = [
  {
    name: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Athletes",
    path: "/athletes",
    icon: Users,
  },
  {
    name: "Training Analytics",
    path: "/training-analytics",
    icon: BarChart3,
  },
  {
    name: "Risk Prediction",
    path: "/risk-prediction",
    icon: TrendingUp,
  },
  {
    name: "Risk Explanation",
    path: "/risk-explanation",
    icon: HelpCircle,
  },
  {
    name: "What-If Simulator",
    path: "/what-if",
    icon: Sliders,
  },
  {
    name: "Recommendations",
    path: "/recommendations",
    icon: Lightbulb,
  },
  {
    name: "Evidence",
    path: "/evidence",
    icon: FileText,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

function Sidebar({ open = true, onClose }) {
  return (
    <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>

      <div>

        <div className="sidebar-brand">

          <div className="sidebar-logo">
            <Activity size={21} />
          </div>

          <div>
            <h1>
              Fit<span>Pulse</span>
            </h1>

            <p>ATHLETE INTELLIGENCE</p>
          </div>

        </div>

        {onClose && (
          <button
            className="sidebar-close"
            onClick={onClose}
            aria-label="Close menu"
          >
            ×
          </button>
        )}

        <nav className="sidebar-nav">

          {items.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `sidebar-link ${
                    isActive ? "active" : ""
                  }`
                }
              >
                <Icon size={17} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}

        </nav>

      </div>

      <div className="sidebar-footer">

        <strong>Train Smarter.</strong>
        <span>Adapt Earlier.</span>
        <b>Perform Better.</b>

      </div>

    </aside>
  );
}

export default Sidebar;