'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from "./templates/user/header/page";
import Form from "./templates/user/formulario/page";
import Footer from './templates/user/footer/page';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [isUser, setIsUser] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const validateSession = async () => {
      const token = localStorage.getItem('sessionToken');

      if (!token) {
        console.log('No hay token, redirigiendo a login');
        router.push('/accounts/inicio-sesion');
        return;
      }

      try {
        const res = await fetch('/api/validate', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const data = await res.json();
          console.error(data.message || 'Error desconocido');
          router.push('/accounts/inicio-sesion');
          return;
        }

        const sessionData = await res.json();
        if (sessionData.role === 'user') {
          setIsUser(true);
        } else {
          console.log('No es usuario, redirigiendo a la administracion');
          router.push('/administracion');
        }
      } catch (error) {
        console.error('Error durante la validación de la sesión:', error);
        router.push('/accounts/inicio-sesion');
      } finally {
        setLoading(false);
      }
    };

    validateSession();
  }, [router]);

  return (
    <>
      <Header />
      <br />
      <Form />
      <br />
      <br />
      <Footer/>
    </>
  );
}
