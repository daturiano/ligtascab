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
import { useInfiniteQuery } from '@tanstack/react-query';
import { ChevronDown, Loader2, Search } from 'lucide-react';
import React, { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { searchDrivers, searchTricycles } from '../db/dashboard';
import DriverSearchCard from './driver-search-card';
import TricycleSearchCard from './tricycle-search-card';

interface SearchResults {
  tricycles: Tricycle[];
  drivers: Driver[];
  hasMore: boolean;
}

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedQuery] = useDebounce(searchQuery, 500);

  const {
    data: searchResults,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: async ({ pageParam = 0 }): Promise<SearchResults> => {
      if (!debouncedQuery.trim()) {
        return { tricycles: [], drivers: [], hasMore: false };
      }

      const [tricycles, drivers] = await Promise.all([
        searchTricycles(debouncedQuery, pageParam),
        searchDrivers(debouncedQuery, pageParam),
      ]);

      const hasMore = tricycles.length === 5 || drivers.length === 5;

      return { tricycles, drivers, hasMore };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // Return next page number if there are more results
      return lastPage.hasMore ? allPages.length : undefined;
    },
    enabled: !!debouncedQuery.trim(),
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  const allTricycles =
    searchResults?.pages.flatMap((page) => page.tricycles) || [];
  const allDrivers = searchResults?.pages.flatMap((page) => page.drivers) || [];

  const resetState = () => {
    setSearchQuery('');
    setIsOpen(false);
  };

  const getTotalResults = () => {
    if (!searchResults) return 0;
    return allDrivers.length + allTricycles.length;
  };

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
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
            {allDrivers && allDrivers.length > 0 && (
              <div className="space-y-2">
                <p className="font-medium text-muted-foreground">
                  {allDrivers.length > 1 ? 'Drivers' : 'Driver'}
                </p>
                <div className="max-h-[450px] overflow-y-auto">
                  {allDrivers.map((driver) => {
                    return (
                      <DriverSearchCard
                        driver={driver}
                        key={driver.id}
                        resetState={resetState}
                      />
                    );
                  })}
                </div>
              </div>
            )}
            {allTricycles && allTricycles.length > 0 && (
              <div className="space-y-2">
                <p className="font-medium text-muted-foreground">
                  {allTricycles.length > 1 ? 'Tricycles' : 'Tricycle'}
                </p>
                <div className="max-h-[450px] overflow-y-auto">
                  {allTricycles.map((tricycle) => {
                    return (
                      <TricycleSearchCard
                        tricycle={tricycle}
                        key={tricycle.id}
                        resetState={resetState}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
        {hasNextPage && (
          <div className="flex w-full gap-2 items-center justify-center p-2 rounded-xl bg-background/60 border-2 border-background hover:bg-background cursor-pointer">
            <button onClick={loadMore}>
              <p className="text-sm">Load more</p>
            </button>
            <ChevronDown size={14} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
