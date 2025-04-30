'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@mdi/react';
import { mdiChevronDown, mdiChevronUp } from '@mdi/js';
import { MenuItem, SubMenuItem } from '@/interface/types';
import { dashboardMenuItems, adminMenuItems } from './dashboardMenuItems';
import DashboardHeader from '../Common/DashboardHeader';
import { useMenuSidebar } from '@/stores/useMenuSidebar';

export default function DashboardLayout({
  children,
  userRole = 'employee',
}: {
  children: React.ReactNode;
  userRole?: 'admin' | 'employee';
}) {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [hoverMenu, setHoverMenu] = useState<string | null>(null);
  const pathname = usePathname();
  const { isOpen } = useMenuSidebar();
  const menuItems = userRole === 'admin' ? adminMenuItems : dashboardMenuItems;

  useEffect(() => {
    //                                                                                                                     Tự động mở menu nếu trang hiện tại thuộc về menu đó
    const autoOpenMenus: Record<string, boolean> = {};
    menuItems.forEach((menu) => {
      if (menu.subMenu && menu.subMenu.some((sub) => pathname === sub.path)) {
        autoOpenMenus[menu.id] = true;
      }
    });
    setOpenMenus(autoOpenMenus);
  }, [pathname, menuItems]);

  const toggleSubMenu = (menuId: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  const isMenuActive = (menu: MenuItem) => {
    if (menu.path && pathname === menu.path) return true;
    if (menu.subMenu) {
      return menu.subMenu.some((sub) => pathname === sub.path);
    }
    return false;
  };

  const isSubMenuActive = (path: string) => {
    return pathname === path;
  };

  const handleMouseEnter = (menuId: string) => {
    if (!isOpen) {
      setHoverMenu(menuId);
    }
  };

  const handleMouseLeave = () => {
    setHoverMenu(null);
  };

  return (
    <div className="flex min-h-screen bg-[#FDFDFD]">
      {/* Sidebar */}
      <div
        className={cn(
          "bg-white shadow-md min-h-screen transition-all duration-300",
          isOpen ? "w-64" : "w-0 md:w-16 overflow-hidden"
        )}
      >
        <div className="flex flex-col h-full">
          <Link href="/admin/statistics">
            <div className={cn("p-4 border-b !max-h-16", isOpen ? "" : "justify-center")}>
              {isOpen ? (
                <h1 className="text-2xl font-bold text-[#2C8B3D] select-none cursor-pointer">
                  Street<span className="text-[#F2A024]">Sneakers</span>
                </h1>
              ) : (
                <h1 className="text-2xl font-bold text-[#2C8B3D] select-none cursor-pointer text-center">
                  S<span className="text-[#F2A024]">T</span>
                </h1>
              )}
            </div>
          </Link>
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className={cn("space-y-1", isOpen ? "px-2" : "px-1")}>
              {menuItems.map((menu) => (
                <li key={menu.id}>
                  {menu.subMenu && isOpen ? (
                    <div className="space-y-1">
                      <button
                        onClick={() => toggleSubMenu(menu.id)}
                        className={cn(
                          'flex items-center justify-between w-full rounded-md p-2 text-left text-sm font-medium transition-colors',
                          isMenuActive(menu)
                            ? 'bg-[#2C8B3D]/10 text-[#2C8B3D]'
                            : 'hover:bg-gray-100'
                        )}
                      >
                        <div className="flex items-center">
                          <Icon
                            path={menu.icon}
                            size={0.8}
                            className={cn(
                              'mr-2',
                              isMenuActive(menu) ? '!text-primary' : '!text-gray-400'
                            )}
                          />
                          <span>{menu.name}</span>
                        </div>
                        <Icon
                          path={openMenus[menu.id] ? mdiChevronUp : mdiChevronDown}
                          size={0.8}
                          className="!text-gray-400"
                        />
                      </button>
                      <AnimatePresence>
                        {openMenus[menu.id] && (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="ml-4 space-y-1 overflow-hidden"
                          >
                            {menu.subMenu.map((subItem: SubMenuItem) => (
                              <motion.li
                                key={subItem.id}
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                              >
                                <Link href={subItem.path}>
                                  <div
                                    className={cn(
                                      'flex items-center rounded-md p-2 text-sm transition-colors',
                                      isSubMenuActive(subItem.path)
                                        ? 'bg-[#F2A024]/10 text-[#F2A024] font-medium'
                                        : 'text-gray-700 hover:bg-gray-100'
                                    )}
                                  >
                                    {subItem.icon && (
                                      <Icon
                                        path={subItem.icon}
                                        size={0.8}
                                        className="mr-2 !text-gray-400"
                                      />
                                    )}
                                    <span>{subItem.name}</span>
                                  </div>
                                </Link>
                              </motion.li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div
                      className="relative"
                      onMouseEnter={() => handleMouseEnter(menu.id)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <Link href={menu.path}>
                        <div
                          className={cn(
                            'flex items-center rounded-md p-2 text-sm font-medium transition-colors',
                            isMenuActive(menu)
                              ? 'bg-[#2C8B3D]/10 text-[#2C8B3D]'
                              : 'text-gray-700 hover:bg-gray-100',
                            !isOpen && 'justify-center'
                          )}
                        >
                          <Icon
                            path={menu.icon}
                            size={0.8}
                            className={cn(
                              isOpen ? 'mr-2' : 'mr-0',
                              isMenuActive(menu) ? '!text-primary' : '!text-gray-400'
                            )}
                          />
                          {isOpen && <span>{menu.name}</span>}
                        </div>
                      </Link>
                      {!isOpen && hoverMenu === menu.id && (
                        <AnimatePresence>
                          <motion.div
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -5 }}
                            transition={{ duration: 0.2 }}
                            className="fixed ml-16 mt-[-30px] bg-white border border-[#2C8B3D]/20 text-gray-700 text-xs py-1.5 px-3 rounded-md shadow-light-grey z-50 whitespace-nowrap flex items-center"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#2C8B3D] mr-1.5"></span>
                            <span className="font-medium">{menu.name}</span>
                          </motion.div>
                        </AnimatePresence>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 p-6 overflow-auto bg-[#E9F3EB]/50">
          {children}
        </main>
      </div>
    </div>
  );
} 