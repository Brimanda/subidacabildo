'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TicketList from '../templates/user/panel/page';
import Footer from '../templates/user/footer/page';
import Header from '../templates/user/header/page';


export default function Home() {
  const [setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const validateSession = async () => {
      const token = localStorage.getItem('sessionToken');

      if (!token) {
        router.push('/accounts/inicio-sesion');
        return;
      }

      try {
        const res = await fetch('/api/validate', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('No autorizado');

        const sessionData = await res.json();
        if (sessionData.role !== 'admin') {
          router.push('/panel');
          return;
        }

        setAuthenticated(true);

      } catch (error) {
        console.error('Error:', error);
        router.push('/accounts/inicio-sesion');
      }
    };

    validateSession();
  }, [router]);

  return (
    <>
      <div className='bg-sky-50'>
        <Header />
        <br />
        <TicketList />
        <Footer />
      </div>
    </>
  );
}
