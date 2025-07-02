import React from "react";
import { NavLink } from "react-router-dom";
import "@/style/tabbar.css";
import "@/style/general.css";
import useUserData from "@/hooks/get_user_data.js";
import {
  HomeIcon as HomeSolid,
  BookOpenIcon as BookSolid,
  UserIcon as UserSolid,
  DocumentChartBarIcon as DataSolid
} from "@heroicons/react/24/solid";
import {
  HomeIcon as HomeOutline,
  BookOpenIcon as BookOutline,
  UserIcon as UserOutline,
  DocumentChartBarIcon as DataOutline
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation.js";



const tabs = [
  {
    name: "courses",
    path: "/courses",
    icon: { active: BookSolid, inactive: BookOutline },
  },
  {
    name: "profile",
    path: "/profile",
    icon: { active: UserSolid, inactive: UserOutline },
  },
];

const admin_tabs = [
  {
    name: "user_data",
    path: "/user_data",
    icon: { active: DataSolid, inactive: DataOutline },
  },
  {
    name: "courses_admin",
    path: "/courses_admin",
    icon: { active: BookSolid, inactive: BookOutline },
  },
  {
    name: "profile",
    path: "/profile",
    icon: { active: UserSolid, inactive: UserOutline },
  },
];

export default function TabBar() {
  const { t } = useTranslation();
  const { user, loading, error } = useUserData(); // ✅ call the hook properly

  if (loading) return null; // or <p>Loading...</p>
  if (error) return <p className="text-red-500">{error}</p>;
  if (!user) return null;

  const currentTabs = user.role === "admin" ? admin_tabs : tabs;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg px-6 py-3 flex justify-around rounded-t-2xl z-50">
      {currentTabs.map(({ name, path, icon }) => (
        <NavLink
          to={path}
          key={name}
          end={path === "/"}
          className="flex flex-col items-center text-xs relative"
        >
          {({ isActive }) => {
            const Icon = isActive ? icon.active : icon.inactive;

            return (
              <motion.div
                initial={{ scale: 0.9, opacity: 0.6 }}
                animate={{
                  scale: isActive ? 1.2 : 1,
                  opacity: isActive ? 1 : 0.6,
                }}
                transition={{ duration: 0.1 }}
                className={`flex flex-col items-center ${
                  isActive ? "txt_color_main font-semibold" : "text-logo-400"
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="mt-1">{t(name)}</span>
              </motion.div>
            );
          }}
        </NavLink>
      ))}
    </nav>
  );
}
