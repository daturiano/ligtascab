'use client';

import emptyImage from '@/app/public/empty.svg';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import DriverCard from '@/features/drivers/components/driver-card';
import { getAllDrivers } from '@/features/drivers/db/drivers';
import { Driver } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, Search, SortDesc } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function DriverPage() {
  const [search, setSearch] = useState('');
  const [isSorted, setIsSorted] = useState(false);
  const [statusSort, setStatusSort] = useState<string[]>(['all']);

  const statusOptions = ['active', 'inactive'];

  const toggleStatus = (status: string) => {
    if (status === 'all') {
      setStatusSort(['all']);
    } else {
      let newStatuses = statusSort.includes(status)
        ? statusSort.filter((s) => s !== status)
        : [...statusSort.filter((s) => s !== 'all'), status];

      // If none selected, default to 'all'
      if (newStatuses.length === 0) {
        newStatuses = ['all'];
      }

      setStatusSort(newStatuses);
    }
  };

  const SetIsSortedHandler = () => {
    setIsSorted((prev) => !prev);
  };

  const resetHandler = () => {
    setIsSorted(false);
    setStatusSort(['all']);
    setSearch('');
  };

  const { data: drivers, error } = useQuery({
    queryKey: ['drivers'],
    queryFn: getAllDrivers,
  });

  if (error) {
    return <div>Error loading drivers: {error.message}</div>;
  }

  const filteredDrivers = drivers
    ?.filter((driver: Driver) => {
      const full_name = driver.first_name + ' ' + driver.last_name;
      return full_name.toLowerCase().includes(search.toLowerCase());
    })
    ?.filter((driver: Driver) => {
      if (statusSort.includes('all')) return true;
      if (!driver.status) return null;
      return statusSort.includes(driver.status?.toLowerCase());
    })
    ?.sort((a: Driver, b: Driver) => {
      const dateA = new Date(a.license_expiration).getTime();
      const dateB = new Date(b.license_expiration).getTime();
      return isSorted ? dateA - dateB : 0;
    });

  return (
    <div className="space-y-4 w-full gap-4 lg:px-20 max-w-screen-2xl mx-auto">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Drivers</h1>
          {drivers && (
            <Button>
              <Link href={'/create-driver'}>Create a driver</Link>
            </Button>
          )}
        </div>
        <div className="w-full flex items-center gap-4">
          <Input
            startIcon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name"
            className="py-6 bg-card rounded-3xl placeholder:tracking-wide placeholder:text-muted-foreground"
          />
          <div className="h-13 p-4 bg-card min-w-[50rem] rounded-xl flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <button
                className={`flex gap-1 py-2 px-4 border shadow-xs rounded-full cursor-pointer bg-card text-xs ${
                  isSorted ? 'bg-primary text-background' : ''
                }`}
                onClick={SetIsSortedHandler}
              >
                <p className="font-normal">Sort by Expiration</p>
                <SortDesc size={14} />
              </button>
              <Popover>
                <PopoverTrigger className="rounded-full cursor-pointer px-5 border py-2 text-xs bg-card flex gap-2 items-center justify-center">
                  <p className="text-popover-foreground">Status</p>
                  <ChevronDown size={14} />
                </PopoverTrigger>
                <PopoverContent align="start">
                  <div className="flex flex-col space-y-6">
                    <div className="flex items-center space-x-4">
                      <Checkbox
                        id="all"
                        checked={statusSort.includes('all')}
                        onCheckedChange={() => toggleStatus('all')}
                      />
                      <label htmlFor="all" className="text-sm capitalize">
                        All
                      </label>
                    </div>
                    {statusOptions.map((status) => (
                      <div key={status} className="flex items-center space-x-4">
                        <Checkbox
                          id={status}
                          checked={statusSort.includes(status)}
                          onCheckedChange={() => toggleStatus(status)}
                        />
                        <label
                          htmlFor={status}
                          className={`text-sm font-medium capitalize`}
                        >
                          {status}
                        </label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex items-center">
              <div className="border-[0.5px] border-r-muted-foreground/20 h-4"></div>
              <Button variant={'ghost'} onClick={resetHandler}>
                <p className="text-xs text-muted-foreground font-light">
                  Reset
                </p>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="min-w-full border-[0.3px] rounded-2xl max-h-[33rem] overflow-y-auto bg-card">
        {!drivers ? (
          <div className="flex items-center justify-center flex-col py-12">
            <Image src={emptyImage} alt="empty image" className="size-36" />
            <div className="flex flex-col space-y-4 text-center mb-8">
              <h2 className="text-xl font-medium">
                Your drivers will appear here
              </h2>
              <h3 className="text-md text-muted-foreground">
                After you create a new driver, you will see it here.
              </h3>
            </div>
            <Button>
              <Link href={'/create-driver'}>Create a driver</Link>
            </Button>
          </div>
        ) : (
          <div className="w-full">
            {filteredDrivers?.map((driver: Driver) => {
              return <DriverCard driver={driver} key={driver.id} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
