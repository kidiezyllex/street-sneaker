'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@mdi/react';
import { mdiChevronDown, mdiChevronUp } from '@mdi/js';
import { MenuItem, SubMenuItem } from '@/interface/types';
import { menuItems } from './menuItems';
import AdminHeader from '../Common/AdminHeader';
import { useMenuSidebar } from '@/stores/useMenuSidebar';

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [hoverMenu, setHoverMenu] = useState<string | null>(null);
  const pathname = usePathname();
  const { isOpen } = useMenuSidebar();

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
    <div className="flex flex-row min-h-screen w-screen">
      {/* Sidebar */}
      <div 
        className={cn(
          "bg-white shadow-md min-h-screen transition-all duration-300",
          isOpen ? "w-60 min-w-60" : "w-0 md:w-16 overflow-hidden"
        )}
      >
        <div className="flex flex-col h-full">
          <div className={cn("p-4 border-b !max-h-16", isOpen ? "" : "justify-center")}>
            {isOpen ? (
              <h1 className="text-2xl  text-primary !font-bold select-none cursor-pointer">
                Street<span className="text-extra">Sneaker</span>
              </h1>
            ) : (
              <h1 className="text-2xl text-primary !font-bold select-none cursor-pointer text-center">
                S<span className="text-extra">S</span>
              </h1>
            )}
          </div>
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className={cn("space-y-1", isOpen ? "px-2" : "px-1")}>
              {menuItems.map((menu) => (
                <li key={menu.id}>
                  {menu.subMenu && isOpen ? (
                    <div className="space-y-1">
                      <button
                        onClick={() => toggleSubMenu(menu.id)}
                        className={cn(
                          'flex items-center font-medium justify-between w-full rounded-[6px] p-2 text-left text-base transition-colors',
                          isMenuActive(menu)
                            ? 'bg-primary/10 text-primary !font-medium'
                            : 'hover:bg-gray-100'
                        )}
                      >
                        <div className="flex items-center">
                          <Icon
                            path={menu.icon}
                            size={0.8}
                            className={cn(
                              'mr-2',
                              isMenuActive(menu) ? 'text-primary !font-medium' : 'text-maintext'
                            )}
                          />
                          <span className={cn('font-medium', isMenuActive(menu) ? 'text-primary !font-medium' : '')}>{menu.name}</span>
                        </div>
                        <Icon
                          path={openMenus[menu.id] ? mdiChevronUp : mdiChevronDown}
                          size={0.8}
                          className="text-maintext"
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
                                      'flex items-center rounded-[6px] p-2 text-base transition-colors font-medium',
                                      isSubMenuActive(subItem.path)
                                        ? 'bg-active/10 text-active !font-medium'
                                        : 'text-gray-700 hover:bg-gray-100'
                                    )}
                                  >
                                    {subItem.icon && (
                                      <Icon
                                        path={subItem.icon}
                                        size={0.8}
                                        className="mr-2 text-maintext"
                                      />
                                    )}
                                    <span className={cn('font-medium', isSubMenuActive(subItem.path) ? 'text-active !font-medium' : '')}>{subItem.name}</span>
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
                            'flex items-center rounded-[6px] p-2 text-base font-medium transition-colors ',
                            isMenuActive(menu)
                              ? 'bg-primary/10 text-primary !font-medium'
                              : 'text-gray-700 hover:bg-gray-100',
                            !isOpen && 'justify-center'
                          )}
                        >
                          <Icon
                            path={menu.icon}
                            size={0.8}
                            className={cn(
                              isOpen ? 'mr-2' : 'mr-0',
                              isMenuActive(menu) ? 'text-primary !font-medium' : 'text-maintext'
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
                            className="fixed ml-16 mt-[-30px] bg-white border border-primary/20 text-main-text text-xs py-1.5 px-3 rounded-[6px] shadow-light-grey z-50 whitespace-nowrap flex items-center"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mr-1.5"></span>
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
      <div className="w-full flex-1 flex flex-col bg-[#1C2B38]">
        <AdminHeader />
        <main className="p-4 min-h-[calc(100vh-66px)]">
          <div style={{ position: 'relative', zIndex: 2 }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 