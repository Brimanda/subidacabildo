'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/app/templates/admin/templates/header/sidebar';

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [id, setId] = useState<string | null>(null);
    const [user, setUser] = useState<{ name: string; email: string; role: string; password?: string } | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const resolveParams = async () => {
            const resolvedParams = await params;
            setId(resolvedParams.id);
        };

        resolveParams();
    }, [params]);

    useEffect(() => {
        if (!id) return;

        const fetchUser = async () => {
            try {
                const response = await fetch(`/api/users/${id}`);
                if (!response.ok) throw new Error('Error al obtener los detalles del usuario');
                const data = await response.json();
                setUser(data);
            }
        };

        fetchUser();
    }, [id]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const response = await fetch(`/api/users/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user),
            });

            if (!response.ok) throw new Error('Error al actualizar el usuario');
            router.push('/administracion/users');
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className="flex h-screen bg-gradient-to-br from-blue-100 to-blue-200">
            <Sidebar />
            <div className="flex-1 ml-16">
                <header className="bg-sky-600 shadow-sm">
                    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-white">
                            Panel de Administración de Tickets Internos
                        </h1>
                    </div>
                </header>
                <main className="container mx-auto px-4 py-12">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                            <div className="px-8 py-8">
                                <h1 className="text-4xl font-extrabold text-blue-900 text-center">Editar Usuario</h1>
                                <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                                    {error && (
                                        <div className="text-center text-red-600 bg-red-100 border border-red-400 rounded-lg py-3 px-4">
                                            {error}
                                        </div>
                                    )}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-blue-900">Nombre</label>
                                            <input
                                                type="text"
                                                value={user.name}
                                                onChange={(e) => setUser({ ...user, name: e.target.value })}
                                                className="mt-1 block w-full px-4 py-3 bg-blue-50 text-blue-900 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-300"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-blue-900">Correo Electrónico</label>
                                            <input
                                                type="email"
                                                value={user.email}
                                                onChange={(e) => setUser({ ...user, email: e.target.value })}
                                                className="mt-1 block w-full px-4 py-3 bg-blue-50 text-blue-900 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-300"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-blue-900">Contraseña</label>
                                            <input
                                                type="password"
                                                placeholder="Dejar vacío para mantener la actual"
                                                onChange={(e) => setUser({ ...user, password: e.target.value })}
                                                className="mt-1 block w-full px-4 py-3 bg-blue-50 text-blue-900 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-300"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-blue-900">Rol</label>
                                            <select
                                                value={user.role}
                                                onChange={(e) => setUser({ ...user, role: e.target.value })}
                                                className="mt-1 block w-full px-4 py-3 bg-blue-50 text-blue-900 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-300"
                                                required
                                            >
                                                <option value="admin">Administrador</option>
                                                <option value="user">Usuario</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-full transition duration-300 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
                                        >
                                            Guardar Cambios
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
