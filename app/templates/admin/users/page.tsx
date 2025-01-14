'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { PlusCircle, Search, Pencil, Trash, Users } from "lucide-react";
import toast from "react-hot-toast";

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export default function UsersPage() {
    const [users, setUsers] = useState<{ id: number; name: string; email: string; role: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/users');
                if (!response.ok) throw new Error('Failed to fetch users');
                const data = await response.json();
                setUsers(data);
            } catch (err) {
                setError("Error al cargar los usuarios.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleEdit = (userId: number) => {
        router.push(`/administracion/users/${userId}/edit`);
    };

    const handleDelete = async (userId: number) => {
        const result = await MySwal.fire({
            title: '¿Estás seguro de que quieres eliminar este usuario?',
            text: '¡Esta acción no se puede deshacer!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'No, cancelar',
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch('/api/users', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId }),
                });
                if (!response.ok) throw new Error('Error al eliminar el usuario');

                setUsers((prev) => prev.filter((user) => user.id !== userId));
                toast.success('Usuario eliminado correctamente', {
                    duration: 3000,
                    position: 'bottom-right',
                    icon: '✅',
                });
            } catch (err) {
                setError("Error al eliminar el usuario.");
            }
        }
    };

    const filteredUsers = users.filter(user =>
        (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.role || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex-1 transition-all duration-300 ease-in-out">
            <main className="p-8">
                <div className="bg-white rounded-xl shadow-xl overflow-hidden   ">
                    <div className="bg-blue-300 px-6 py-8">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-black">Gestión de Usuarios</h1>
                                <p className="text-black-100">Gestiona y visualiza todos los usuarios del sistema</p>
                            </div>
                            <div>
                                <button
                                    onClick={() => router.push('/administracion/users/create')}
                                    className="bg-cyan-700  hover:bg-cyan-500 text-white font-semibold py-2 px-4 rounded-xl transition duration-300 flex items-center shadow-md"
                                >
                                    <PlusCircle className="mr-2 h-5 w-5" /> Agregar Usuario
                                </button>
                            </div>
                        </div>
                        <div className="relative mb-6">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyan-400" />
                            <input
                                placeholder="Buscar usuarios por nombre, correo, rol o departamento"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-cyan-50 text-cyan-900 border border-cyan-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition duration-300"
                            />
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-600" />
                            </div>
                        ) : error ? (
                            <div className="text-center text-red-600 bg-red-100 border border-red-400 rounded-md py-3 px-4 mb-4">
                                <p>{error}</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto bg-white rounded-lg shadow">
                                <table className="min-w-full divide-y divide-cyan-200">
                                    <thead className="bg-cyan-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-cyan-800 uppercase tracking-wider">ID</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-cyan-800 uppercase tracking-wider">Nombre</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-cyan-800 uppercase tracking-wider">Correo</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-cyan-800 uppercase tracking-wider">Rol</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-cyan-800 uppercase tracking-wider">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-cyan-200">
                                        {filteredUsers.map((user) => (
                                            <tr key={`${user.id}-${user.email}`} className="hover:bg-cyan-50 transition duration-300">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-900">{user.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <Users className="h-10 w-10 rounded-full text-cyan-500" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-cyan-900">{user.name}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-900">{user.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        onClick={() => handleEdit(user.id)}
                                                        className="text-cyan-600 hover:text-cyan-900 transition duration-300 mr-3"
                                                        aria-label={`Editar usuario ${user.name}`}
                                                    >
                                                        <Pencil className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(user.id)}
                                                        className="text-red-600 hover:text-red-900 transition duration-300"
                                                        aria-label={`Eliminar usuario ${user.name}`}
                                                    >
                                                        <Trash className="h-5 w-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
