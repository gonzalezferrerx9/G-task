// =================================================================================================================================================================
// PÁGINA DE REGISTRO
// =================================================================================================================================================================
'use client';

// =================================================================================================================================================================
// IMPORTACIONES
// =================================================================================================================================================================
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/use-user';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

// =================================================================================================================================================================
// COMPONENTE DE LA PÁGINA DE REGISTRO
// =================================================================================================================================================================
export default function SignUpPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (error: any) {
       let description = 'Ocurrió un error inesperado durante el registro.';
       
       switch (error.code) {
        case 'auth/email-already-in-use':
          description = 'Este correo electrónico ya está en uso. Por favor, prueba con otro.';
          break;
        case 'auth/weak-password':
          description = 'La contraseña es demasiado débil. Por favor, usa al menos 6 caracteres.';
          break;
        case 'auth/invalid-email':
          description = 'El formato del correo electrónico no es válido.';
          break;
        default:
          description = `Error: ${error.code || 'Desconocido'}. ${error.message}`;
          break;
       }

      toast({
        variant: 'destructive',
        title: 'Error de Autenticación',
        description: description,
      });
    }
  };
  
  if (loading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-2xl">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold font-headline">Crear una Cuenta</CardTitle>
          <CardDescription className="text-lg">Ingresa tu correo y contraseña para comenzar.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full text-lg">
              Registrarse
            </Button>
          </form>
          <div className="mt-4 text-center text-lg">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/login" className="underline">
              Inicia sesión
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
