'use client';

import { useState } from 'react';
import { IconSearch } from '@tabler/icons-react';

export default function SearchBar() {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Xử lý tìm kiếm với giá trị query
    console.log('Tìm kiếm:', query);
  };

  return (
    <form 
      onSubmit={handleSearch}
      className="relative w-full max-w-md"
    >
      <div className="relative">
        <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-9 w-full rounded-full bg-gray-100 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
    </form>
  );
} 