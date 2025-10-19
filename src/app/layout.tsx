// =================================================================================================================================================================
// LAYOUT.TSX (PLANTILLA PRINCIPAL)
// =================================================================================================================================================================
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/use-user';
import { ThemeProvider } from '@/components/theme-provider';

// =================================================================================================================================================================
// METADATOS
// =================================================================================================================================================================
export const metadata: Metadata = {
  title: 'G-Task',
  description: 'Un tablero Kanban para gestionar tus tareas y flujos de trabajo.',
};

// =================================================================================================================================================================
// PLANTILLA RAÍZ
// =================================================================================================================================================================
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>{children}</AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
