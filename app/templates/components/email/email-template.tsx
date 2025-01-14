import * as React from 'react';

interface EmailTemplateProps {
    nombre: string;
    mensaje: string;
}

export const EmailTemplate: React.FC<EmailTemplateProps> = ({ nombre, mensaje }) => {
    return (
        <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
            </head>
            <body style={{
                backgroundColor: '#f3f4f6',
                fontFamily: 'Arial, sans-serif',
                margin: 0,
                padding: 0,
            }}>
                <table width="100%" cellPadding="0" cellSpacing="0" style={{ backgroundColor: '#f3f4f6' }}>
                    <tr>
                        <td align="center" style={{ padding: '20px 0' }}>
                            <table width="100%" cellPadding="0" cellSpacing="0" style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', }}>
                                <tr>
                                    <td style={{ backgroundColor: '#3b82f6', padding: '20px', textAlign: 'center', color: '#ffffff', }}>
                                        <h1 style={{
                                            margin: 0,
                                            fontSize: '24px',
                                            fontWeight: 'bold',
                                        }}>Municipalidad de Cabildo</h1>
                                        <p style={{
                                            margin: '10px 0 0',
                                            fontSize: '16px',
                                            fontWeight: 'normal',
                                        }}>Reestablecimiento de contraseña</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '30px 20px' }}>
                                        <h2 style={{
                                            margin: '0 0 20px',
                                            fontSize: '20px',
                                            fontWeight: 'bold',
                                            color: '#1e40af',
                                        }}>Hola, {nombre}</h2>
                                        <p style={{
                                            margin: '0 0 20px',
                                            fontSize: '16px',
                                            lineHeight: '1.5',
                                            color: '#4b5563',
                                        }}>{mensaje}</p>
                                        <div style={{
                                            backgroundColor: '#e0f2fe',
                                            borderLeft: '4px solid #3b82f6',
                                            padding: '15px',
                                            marginBottom: '20px',
                                        }}>
                                            <p style={{
                                                margin: 0,
                                                fontSize: '14px',
                                                color: '#1e40af',
                                            }}>El link estará disponible por 1 hora desde el envío</p>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{
                                        backgroundColor: '#f3f4f6',
                                        padding: '20px',
                                        textAlign: 'center',
                                        borderTop: '1px solid #e5e7eb',
                                    }}>
                                        <p style={{
                                            margin: '0 0 10px',
                                            fontSize: '14px',
                                            color: '#6b7280',
                                        }}>Municipalidad de Cabildo, Humeres 499, 2050290 Cabildo, Valparaíso</p>
                                        <p style={{
                                            margin: '0 0 20px',
                                            fontSize: '14px',
                                            color: '#6b7280',
                                        }}>Teléfono: (33) 276 2100 | Correo Soporte: miguel.reyes@municipiocabildo.cl</p>
                                        <img
                                            src="https://i.ibb.co/BsgbTFD/471694412-904324675241027-5753525435701372118-n.jpg"
                                            alt="Logo Municipalidad"
                                            style={{
                                                maxWidth: '200px',
                                                height: 'auto',
                                            }}
                                        />

                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
        </html>
    );
};

