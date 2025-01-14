'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Sidebar from '@/app/templates/admin/templates/header/sidebar'
import { Eye, EyeOff } from 'lucide-react' 
import { useRouter } from 'next/navigation'

import "react-toastify/dist/ReactToastify.css"
import { toast } from 'react-hot-toast'

const formSchema = z.object({
    name: z.string().min(2, {
        message: 'El nombre debe contener más de 2 caracteres',
    }),
    email: z.string().email({
        message: 'Porfavor ingresa un correo electrónico válido',
    }),
    password: z.string().min(8, {
        message: 'La contraseña debe contener al menos 8 caracteres',
    }),
    role: z.enum(['user', 'admin'], {
        message: 'El rol debe ser usuario o administrador',
    }),
})

export default function CreateUserPage() {
    const [isSidebarOpen, setSidebarOpen] = useState(false)
    const [passwordVisible, setPasswordVisible] = useState(false) 
    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            role: 'user',
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                throw new Error('Error creating user');
            }

            setTimeout(() => {
                router.push('/administracion/users');
            }, 4000);

            toast.success('Usuario creado correctamente', {
                duration: 3000,
                position: 'bottom-right',
                icon: '✅',
            });

        } catch (error) {
            toast.error('Hubo un error al crear el usuario', {
                duration: 3000,
                position: 'bottom-right',
                icon: '❌',
            });
        }
    }

    const handleSidebarToggle = (isOpen: boolean) => {
        setSidebarOpen(isOpen)
    }

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible)
    }

    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
            <Sidebar />
            <div
                className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}
            >
                <header className="bg-sky-600 shadow-sm">
                    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center ">
                        <h1 className="text-2xl font-semibold text-white">
                            Panel de Administración de Tickets Internos
                        </h1>
                    </div>
                </header>
                <main className="container mx-auto px-4 py-12">
                    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                        <div className="px-6 py-8 sm:p-10">
                            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">
                                Crear nuevo usuario
                            </h2>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 dark:text-gray-300">Nombre</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            placeholder="Ingresa el nombre del usuario"
                                                            {...field}
                                                            className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="text-red-500" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 dark:text-gray-300">Correo electrónico</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            placeholder="Ingresa el correo electrónico"
                                                            {...field}
                                                            className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="text-red-500" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 dark:text-gray-300">Contraseña</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            type={passwordVisible ? 'text' : 'password'}
                                                            {...field}
                                                            placeholder="Ingresa la contraseña de la cuenta"
                                                            className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={togglePasswordVisibility}
                                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-400"
                                                        >
                                                            {passwordVisible ? (
                                                                <EyeOff className="w-5 h-5" />
                                                            ) : (
                                                                <Eye className="w-5 h-5" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="text-red-500" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="role"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 dark:text-gray-300">Rol</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <select
                                                            {...field}
                                                            className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                        >
                                                            <option value="">Selecciona el rol del usuario a registrar</option>
                                                            <option value="user">Usuario</option>
                                                            <option value="admin">Administrador</option>
                                                        </select>
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="text-red-500" />
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        type="submit"
                                        className="w-full bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    >
                                        Crear Usuario
                                    </Button>
                                </form>
                            </Form>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
