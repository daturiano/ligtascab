import React from 'react';

export default function OptionsButton({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="cursor-pointer w-full py-2 rounded-md flex items-center justify-center bg-muted-foreground/20 hover:bg-muted-foreground/15 lg:size-10 lg:rounded-full">
      {children}
    </div>
  );
}
