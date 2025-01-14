'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export default function PasswordRecovery() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
  
    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setSuccess(true);
        MySwal.fire({
          title: 'Éxito',
          text: data.message,
          icon: 'success',
        });

        router.push('/accounts/volver-a-inicio');
      } else {
        setError(data.error);
        MySwal.fire({
          title: 'Error',
          text: data.error,
          icon: 'error',
        });
      }
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      setError('Hubo un problema al enviar el correo de recuperación');
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
              <label htmlFor="email" className="block text-sm font-medium text-gray-600">Correo electrónico</label>
              <input
                type="email"
                name="email"
                placeholder="Ingresa tu correo electrónico"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="mt-1 block w-full px-4 py-2 border border-sky-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            {message && <p className="text-sm text-green-500">{message}</p>}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 ${loading ? 'bg-gray-400' : 'bg-sky-600'} text-white font-semibold rounded-md hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500`}
            >
              {loading ? 'Enviando...' : 'Enviar correo de recuperación'}
            </button>
          </form>
          <br />
          <div className='text-center items-center'>
            <a href="/accounts/inicio-sesion" className="w-full py-2 bg-transparent text-sky-600 font-semibold text-sm hover:text-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500">
              Cancelar
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
