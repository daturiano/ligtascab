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
import TricycleCard from '@/features/tricycles/components/tricycle-card';
import { getAllTricycles } from '@/features/tricycles/db/tricycles';
import { Tricycle } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, Search, SortDesc } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function TricyclesPage() {
  const [search, setSearch] = useState('');
  const [isSorted, setIsSorted] = useState(false);
  const [statusSort, setStatusSort] = useState<string[]>(['all']);

  const statusOptions = ['active', 'inactive', 'maintenance'];

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

  const { data: tricycles, error } = useQuery({
    queryKey: ['tricycles'],
    queryFn: getAllTricycles,
  });

  if (error) {
    return <div>Error loading tricycles: {error.message}</div>;
  }

  const filteredTricycles = tricycles
    ?.filter((tricycle: Tricycle) =>
      tricycle.plate_number.toLowerCase().includes(search.toLowerCase())
    )
    ?.filter((tricycle: Tricycle) => {
      if (statusSort.includes('all')) return true;
      return statusSort.includes(tricycle.status?.toLowerCase());
    })
    ?.sort((a: Tricycle, b: Tricycle) => {
      const dateA = new Date(a.registration_expiry).getTime();
      const dateB = new Date(b.registration_expiry).getTime();
      return isSorted ? dateA - dateB : 0;
    });

  return (
    <div className="space-y-4 w-full gap-4 lg:px-20 max-w-screen-2xl mx-auto">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Tricycles</h1>
          {tricycles && (
            <Button>
              <Link href={'/create-tricycle'}>Create a tricycle</Link>
            </Button>
          )}
        </div>
        <div className="w-full flex items-center gap-4">
          <Input
            startIcon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by plate number"
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
        {!tricycles ? (
          <div className="flex items-center justify-center flex-col py-12">
            <Image src={emptyImage} alt="empty image" className="size-36" />
            <div className="flex flex-col space-y-4 text-center mb-8">
              <h2 className="text-xl font-medium">
                Your tricycles will appear here
              </h2>
              <h3 className="text-md text-muted-foreground">
                After you create a new vehicle, you will see it here.
              </h3>
            </div>
            <Button>
              <Link href={'/create-tricycle'}>Create a vehicle</Link>
            </Button>
          </div>
        ) : (
          <div className="w-full">
            {filteredTricycles?.map((tricycle: Tricycle) => {
              return <TricycleCard tricycle={tricycle} key={tricycle.id} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
