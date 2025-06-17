import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "@/style/tabbar.css";
import "@/style/general.css";
import {
  HomeIcon as HomeSolid,
  BookOpenIcon as BookSolid,
  UserIcon as UserSolid,
} from "@heroicons/react/24/solid";
import {
  HomeIcon as HomeOutline,
  BookOpenIcon as BookOutline,
  UserIcon as UserOutline,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const tabs = [
  {
    name: "Courses",
    path: "/courses",
    icon: { active: BookSolid, inactive: BookOutline },
  },
  {
    name: "Profile",
    path: "/profile",
    icon: { active: UserSolid, inactive: UserOutline },
  },
];

const admin_tabs = [
  {
    name: "Courses Admin",
    path: "/courses_admin",
    icon: { active: BookSolid, inactive: BookOutline },
  },
  {
    name: "Profile",
    path: "/profile",
    icon: { active: UserSolid, inactive: UserOutline },
  },
];

export default function TabBar() {
  const [user, setUser] = useState({
    name: "Abebe Kebede",
    xp: 134679,
    email: "Abebe@example.com",
    username: "Abebe_1",
    country: "Ethiopia",
    joined: "January 2023",
    Current_course: "January 2023",
    Current_module: "January 2023",
    Current_section: "January 2023",
    avatar: "avatar",
    role: "user",
  });
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg px-6 py-3 flex justify-around rounded-t-2xl z-50">
      {user.role == "user"
        ? tabs.map(({ name, path, icon }) => (
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
                      isActive
                        ? "txt_color_main font-semibold"
                        : "text-gray-400"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="mt-1">{name}</span>
                  </motion.div>
                );
              }}
            </NavLink>
          ))
        : user.role == "admin"
        ? admin_tabs.map(({ name, path, icon }) => (
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
                      isActive
                        ? "txt_color_main font-semibold"
                        : "text-gray-400"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="mt-1">{name}</span>
                  </motion.div>
                );
              }}
            </NavLink>
          ))
        : null}
    </nav>
  );
}
