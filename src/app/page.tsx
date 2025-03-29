'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/login');
    } else {
      router.push('/collections');
    }
  }, [router]);

  return (
    <div>
    </div>
  );
};

export default Home;
