'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import React from 'react';

const MySwal = withReactContent(Swal);

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Token inválido o expirado.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError('Token no encontrado.');
      return;
    }

    if (password !== confirmPassword) {
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden.',
      });
      return;
    }

    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al restablecer la contraseña');
      }

      MySwal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Tu contraseña ha sido restablecida correctamente.',
      });

      setSuccess(true);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Error al restablecer la contraseña');
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || 'Error al restablecer la contraseña.',
      });
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
          <h4 className="font-semibold text-gray-800 text-center">Restablecer Contraseña</h4>
          <br />
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {success ? (
            <p className="text-green-500 text-center">
              ¡Contraseña restablecida correctamente! Redirigiendo...
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                  Nueva contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Ingresa tu nueva contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-sky-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600">
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirma tu nueva contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-sky-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-sky-600 text-white font-semibold rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                Restablecer contraseña
              </button>
            </form>
          )}
          <br />
          <div className="text-center">
            <a href="/auth/login" className="text-sky-600 hover:underline">
              Volver a iniciar sesión
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
