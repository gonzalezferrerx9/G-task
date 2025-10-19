// =================================================================================================================================================================
// PÁGINA DE INICIO DE SESIÓN
// =================================================================================================================================================================
'use client';

// =================================================================================================================================================================
// IMPORTACIONES
// =================================================================================================================================================================
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/use-user';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

// =================================================================================================================================================================
// COMPONENTE DE LA PÁGINA DE INICIO DE SESIÓN
// =================================================================================================================================================================
export default function LoginPage() {
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

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (error: any) {
      let description = 'Ocurrió un error inesperado. Inténtalo de nuevo.';
      
      switch (error.code) {
        case 'auth/invalid-credential':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          description = 'Credenciales no válidas. Revisa tu correo y contraseña.';
          break;
        case 'auth/invalid-email':
          description = 'El formato del correo electrónico no es válido.';
          break;
        case 'auth/operation-not-allowed':
          description = 'El inicio de sesión por correo y contraseña no está habilitado en la consola de Firebase.';
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
          <CardTitle className="text-4xl font-bold font-headline">G-Task</CardTitle>
          <CardDescription className="text-lg">Inicia sesión para acceder a tu tablero Kanban.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
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
              Iniciar Sesión
            </Button>
          </form>
          <div className="mt-4 text-center text-lg">
            ¿No tienes una cuenta?{' '}
            <Link href="/signup" className="underline">
              Regístrate
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
