import { BookCopy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn("flex items-center", className)}>
      <BookCopy className="h-6 w-6 text-blue-600" />
      <span className="ml-2 text-xl font-bold text-gray-800">CV Manager</span>
    </div>
  );
}