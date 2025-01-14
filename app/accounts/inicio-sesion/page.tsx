'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
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

        console.error('Error de autenticación:', errorData.message || 'Error desconocido');
        return;
      }

      const data = await response.json();
      setMessage(`Bienvenido, ${data.email}!`);

      localStorage.setItem('sessionToken', data.token);

      MySwal.fire({
        title: 'Inicio de sesión exitoso',
        text: 'Has iniciado sesión correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        timer: 500,
      });

      if (data.role === 'admin') {
        router.push('/administracion');
      } else {
        router.push('/');
      }
    } catch (error) {
      setError('Hubo un error al intentar iniciar sesión. Intenta nuevamente.');
      console.error('Error durante el login:', error);
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
          <h4 className="font-semibold text-gray-800 text-center">Sistema de gestión de tickets para requerimientos del área de informática</h4>
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
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-600">Contraseña</label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  name="password"
                  placeholder="Ingresa tu contraseña"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-sky-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" onClick={() => setShowPwd(!showPwd)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M15 12c0 1.654-1.346 3-3 3s-3-1.346-3-3 1.346-3 3-3 3 1.346 3 3zm9-.449s-4.252 8.449-11.985 8.449c-7.18 0-12.015-8.449-12.015-8.449s4.446-7.551 12.015-7.551c7.694 0 11.985 7.551 11.985 7.551zm-7 .449c0-2.757-2.243-5-5-5s-5 2.243-5 5 2.243 5 5 5 5-2.243 5-5z" /></svg>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-sky-600 text-white font-semibold rounded-md hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              Iniciar sesión
            </button>
            <button className="w-full py-2 bg-transparent text-sky-600 font-semibold text-sm hover:text-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500">
              <a href="/accounts/recuperar-contrasena">¿Has olvidado tu contraseña?</a>
            </button>
              </form>
            </div>
          </div>
        </div>
      );
    }
