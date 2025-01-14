'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export default function PasswordRecovery() {
  const [email, setEmail] = useState('');
  const [setError] = useState('');
  const [setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/password-recovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Error desconocido');
        MySwal.fire({
          title: 'Error',
          text: errorData.message || 'Error desconocido',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
        return;
      }

      setMessage('Te hemos enviado un correo con un enlace para recuperar tu contraseña.');
      
      MySwal.fire({
        title: 'Correo enviado',
        text: 'Revisa tu correo para completar la recuperación de la contraseña.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });

      router.push('/');  

    } catch (error) {
      setError('Hubo un error al intentar enviar el correo. Intenta nuevamente.');
      console.error('Error durante la recuperación:', error);
    }
  };

  return (
    <div className="relative h-screen bg-sky-600 bg-cover bg-center" style={{ backgroundImage: "url('/municipalidad.jpg')" }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="bg-white p-10 rounded-xl shadow-lg max-w-sm w-full mx-4 md:mx-0">
          <div className="flex justify-center items-center">
            <img src="/logo.jpg" alt="Logo" className="logo-class" />
          </div>
          <br />
          <h4 className="font-semibold text-gray-800 text-center">Recuperar contraseña</h4>
          <br />
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-600">Correo Electrónico</label>
              <input
                type="email"
                name="email"
                placeholder="Inserta tu correo electrónico"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="mt-1 block w-full px-4 py-2 border border-sky-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-sky-600 text-white font-semibold rounded-md hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              Enviar correo de recuperación
            </button>
          </form>
          <br />
          <div className='text-center items-center'>
            <a href="/accounts/inicio-sesion" className="w-full py-2 bg-transparent text-sky-600 font-semibold text-sm hover:text-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500">
            Cancelar</a>
          </div>
          <h4 className="font-semibold text-gray-800 text-center">Se ha enviado un correo de recuperación</h4>
          <br />
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className='text-center items-center'>
              <a href="/accounts/inicio-sesion" className="w-full py-2 bg-transparent text-sky-600 font-semibold text-sm hover:text-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500">
              Volver a Inicio de Sesión</a>
            </div>
            
          </form>
          <br />
        </div>
      </div>
    </div>
  );
}
