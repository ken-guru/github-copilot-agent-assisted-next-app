import { useEffect } from 'react';
import { useRouter } from 'next/router';
import HomePage from '../src/app/page';

// This file bridges the Pages Router and App Router
// It simply renders the App Router's Home page component
export default function Home() {
  return <HomePage />;
}