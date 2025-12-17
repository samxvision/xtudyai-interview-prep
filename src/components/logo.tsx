import Link from 'next/link';
import { Bot } from 'lucide-react';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-lg font-bold font-headline text-foreground">
      <div className="p-2 bg-primary text-primary-foreground rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
           <path d="M14.5 16.5_5.5-5.5" />
           <path d="M8.5 5.5 18.5 15.5" />
           <circle cx="12" cy="12" r="10" />
          </svg>
      </div>
      <span>XtudyAI</span>
    </Link>
  );
}
