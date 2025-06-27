import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Driver, Tricycle } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Search } from 'lucide-react';
import React, { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { searchDrivers, searchTricycles } from '../db/dashboard';
import DriverSearchCard from './driver-search-card';
import TricycleSearchCard from './tricycle-search-card';

type SearchResults = {
  tricycles: Tricycle[];
  drivers: Driver[];
};

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedQuery] = useDebounce(searchQuery, 500);

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: async (): Promise<SearchResults> => {
      if (!debouncedQuery.trim()) {
        return { tricycles: [], drivers: [] };
      }
      const [tricycles, drivers] = await Promise.all([
        searchTricycles(debouncedQuery),
        searchDrivers(debouncedQuery),
      ]);
      return { tricycles, drivers };
    },
    enabled: debouncedQuery.length > 0,
    staleTime: 30000,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  const getTotalResults = () => {
    if (!searchResults) return 0;
    return searchResults.tricycles.length + searchResults.drivers.length;
  };

  const resetState = () => {
    setSearchQuery('');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="size-10 m-0 rounded-full bg-muted-foreground/20 flex items-center justify-center cursor-pointer">
          <Search size={24} />
        </div>
      </DialogTrigger>
      <DialogHeader>
        <DialogTitle />
        <DialogDescription />
      </DialogHeader>
      <DialogContent
        className="sm:max-w-lg md:max-w-2xl lg:max-w-4xl bg-white"
        showCloseButton={false}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Input
          startIcon={Search}
          type="text"
          placeholder="Search for tricycles or drivers"
          value={searchQuery}
          onChange={handleInputChange}
          className="pl-10 px-12 py-6 w-full rounded-3xl"
        />
        {isLoading && (
          <div className="p-4 text-center text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
            Searching...
          </div>
        )}
        {getTotalResults() === 0 && debouncedQuery && !isLoading ? (
          <div className="p-4 text-center text-gray-500">
            No results found for &quot;{debouncedQuery}&quot;
          </div>
        ) : (
          <>
            {searchResults?.drivers && searchResults.drivers.length > 0 && (
              <div className="space-y-2">
                <p className="font-medium text-muted-foreground">
                  {searchResults.drivers.length > 1 ? 'Drivers' : 'Driver'}
                </p>
                {searchResults.drivers.map((driver) => {
                  return (
                    <DriverSearchCard
                      driver={driver}
                      key={driver.id}
                      resetState={resetState}
                    />
                  );
                })}
              </div>
            )}
            {searchResults?.tricycles && searchResults.tricycles.length > 0 && (
              <div className="space-y-2">
                <p className="font-medium text-muted-foreground">
                  {searchResults.tricycles.length > 1
                    ? 'Tricycles'
                    : 'Tricycle'}
                </p>
                {searchResults.tricycles.map((tricycle) => {
                  return (
                    <TricycleSearchCard
                      tricycle={tricycle}
                      key={tricycle.id}
                      resetState={resetState}
                    />
                  );
                })}
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
