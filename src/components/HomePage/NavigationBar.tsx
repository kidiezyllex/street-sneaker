import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Icon } from '@mdi/react';
import { mdiCart } from '@mdi/js';
import { Button } from '@/components/ui/button';
import { useUser } from '@/context/useUserContext';
import AccountDropdown from './AccountDropdown';
import { useCartStore } from '@/stores/useCartStore';
import CartSheet from '../ui/CartSheet';

const tabs = [
    { text: 'Trang chủ', href: '/' },
    { text: 'Sản phẩm', href: '/products' },
    { text: 'Giới thiệu', href: '/about-us' },
];

interface TabProps {
    text: string;
    selected: boolean;
    setSelected: (text: string) => void;
}

const Tab = ({ text, selected, setSelected }: TabProps) => {
    return (
        <button
            onClick={() => setSelected(text)}
            className={`${selected
                ? 'text-white'
                : 'text-maintext hover:text-maintext dark:hover:text-gray-100'
                } relative rounded-[6px] px-3 py-1.5 text-sm font-medium transition-colors`}
        >
            <span className="relative z-10">{text}</span>
            {selected && (
                <motion.span
                    layoutId="tab"
                    transition={{ type: 'spring', duration: 0.4 }}
                    className="absolute inset-0 z-0 rounded-sm bg-primary/80"
                ></motion.span>
            )}
        </button>
    );
};
export const NavigationBar = () => {
    const [selected, setSelected] = useState<string>(tabs[0].text);
    const { isAuthenticated, user } = useUser();
    const { totalItems } = useCartStore();
    const checkPath = () => {
        const currentPath = window.location.pathname;
        const activeTab = tabs.find(tab => tab.href === currentPath);
        if (activeTab) {
            setSelected(activeTab.text);
        }
    };
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
        checkPath();
    }, []);

    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm py-4">
            <div className="container mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center">
                    <h1 className="text-2xl font-bold text-primary select-none cursor-pointer">
                        Street<span className="text-extra">Sneaker</span>
                    </h1>
                </Link>

                {/* Navigation */}
                <div className="hidden md:flex items-center space-x-1">
                    {tabs.map((tab) => (
                        <Link key={tab.text} href={tab.href} passHref legacyBehavior>
                            <a>
                                <Tab
                                    text={tab.text}
                                    selected={selected === tab.text}
                                    setSelected={setSelected}
                                />
                            </a>
                        </Link>
                    ))}
                </div>
                {/* User Actions */}
                <div className="flex items-center gap-2">
                    {!isAuthenticated ? (
                        <div className="hidden md:flex items-center gap-2">
                            <Link href="/auth/login">
                                <Button variant="outline" size="sm" className='border border-primary text-primary hover:text-primary/80 rounded-sm'>
                                    Đăng nhập
                                </Button>
                            </Link>
                            <Link href="/auth/register">
                                <Button size="sm" className='rounded-sm bg-primary/80'>Đăng ký</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center gap-2">
                            <span className="text-sm font-medium text-maintext">
                                Xin chào, <span className='text-primary font-bold'>{user?.fullName || 'Khách hàng'}</span>
                            </span>
                        </div>
                    )}
                    <div className="flex items-center">
                        <button onClick={() => setIsOpen(true)} className="relative p-2 text-maintext hover:text-primary transition-colors">
                            <Icon path={mdiCart} size={0.7} />
                            <span className="absolute -top-1 -right-1 bg-extra text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                {totalItems}
                            </span>
                        </button>
                        <AccountDropdown />
                    </div>
                </div>
            </div>
            <CartSheet
                open={isOpen}
                onOpenChange={setIsOpen}
            />
        </header>
    );
};

export default NavigationBar; 