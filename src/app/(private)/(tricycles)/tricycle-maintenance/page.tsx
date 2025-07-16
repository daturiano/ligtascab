'use client';

import emptyImage from '@/app/public/empty.svg';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { fetchAllMaintenanceRecords } from '@/features/tricycles/actions/tricycles';
import { maintenance_columns } from '@/features/tricycles/components/maintenance-columns';
import { MaintenanceTable } from '@/features/tricycles/components/maintenance-table';
import { MaintenanceRecords } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function TricycleMaintenancePage() {
  const [search, setSearch] = useState('');
  const [typeSort, setTypeSort] = useState<string[]>(['all']);

  const typeOptions = ['regular', 'repair'];

  const toggleType = (type: string) => {
    if (type === 'all') {
      setTypeSort(['all']);
    } else {
      let newTypes = typeSort.includes(type)
        ? typeSort.filter((s) => s !== type)
        : [...typeSort.filter((s) => s !== 'all'), type];

      // If none selected, default to 'all'
      if (newTypes.length === 0) {
        newTypes = ['all'];
      }

      setTypeSort(newTypes);
    }
  };

  const resetHandler = () => {
    setTypeSort(['all']);
    setSearch('');
  };

  const { data: maintenance_records, error } = useQuery({
    queryKey: ['maintenance_records'],
    queryFn: fetchAllMaintenanceRecords,
  });

  if (error) {
    return <div>Error loading logs: {error.message}</div>;
  }

  if (!maintenance_records) return null;

  const filteredMaintenance = maintenance_records
    ?.filter((record: MaintenanceRecords) =>
      record.plate_number.toLowerCase().includes(search.toLowerCase())
    )
    ?.filter((record: MaintenanceRecords) => {
      if (typeSort.includes('all')) return true;
      if (!record.type) return null;
      return typeSort.includes(record.type.toLowerCase());
    });

  return (
    <div className="space-y-4 gap-4 mx-auto mb-12">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-base lg:text-3xl font-semibold">
            Maintenance Records
          </h1>
          {maintenance_records && (
            <Link href={`tricycle-maintenance/create-record`}>
              <Button>Create New Record</Button>
            </Link>
          )}
        </div>
        <div className="w-full flex flex-col gap-2 items-center lg:flex-row lg:gap-6">
          <Input
            startIcon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by plate number"
            className="bg-card rounded-3xl placeholder:tracking-wide placeholder:text-muted-foreground"
          />
          <div className="h-13 w-full px-2 bg-card rounded-xl flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <Popover>
                <PopoverTrigger className="rounded-full cursor-pointer px-2 border py-2 text-xs bg-card flex gap-2 items-center justify-center">
                  <p className="text-popover-foreground">Status</p>
                  <ChevronDown size={14} />
                </PopoverTrigger>
                <PopoverContent align="start">
                  <div className="flex flex-col space-y-6">
                    <div className="flex items-center space-x-4">
                      <Checkbox
                        id="all"
                        checked={typeSort.includes('all')}
                        onCheckedChange={() => toggleType('all')}
                      />
                      <label htmlFor="all" className="text-sm capitalize">
                        All
                      </label>
                    </div>
                    {typeOptions.map((status) => (
                      <div key={status} className="flex items-center space-x-4">
                        <Checkbox
                          id={status}
                          checked={typeSort.includes(status)}
                          onCheckedChange={() => toggleType(status)}
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
            <div className="ml-6 flex items-center">
              <div className="border-[0.5px] border-r-muted-foreground/20 h-4"></div>
              <Button variant={'ghost'} onClick={resetHandler}>
                <p
                  className={`text-xs ${
                    search !== '' || typeSort[0] !== 'all'
                      ? 'font-medium'
                      : 'font-light text-muted-foreground'
                  }`}
                >
                  Reset
                </p>
              </Button>
            </div>
          </div>
        </div>
      </div>
      {filteredMaintenance.length <= 0 ? (
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
        <Card className="w-full min-w-[350px] max-h-[34rem]">
          <CardContent>
            <MaintenanceTable
              data={filteredMaintenance ?? []}
              columns={maintenance_columns}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
