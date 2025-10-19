// =================================================================================================================================================================
// PÁGINA PRINCIPAL (APLICACIÓN)
// =================================================================================================================================================================
'use client';

// =================================================================================================================================================================
// IMPORTACIONES
// =================================================================================================================================================================
import KanbanBoard from '@/components/kanban/KanbanBoard';
import { useUser } from '@/hooks/use-user';
import { auth } from '@/firebase/config';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { signOut } from 'firebase/auth';
import { User, Settings, HelpCircle, PlusSquare, Github } from 'lucide-react';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { InteractiveTutorial } from '@/components/tutorial/InteractiveTutorial';
import { tutorialSteps, TutorialAction } from '@/lib/tutorial-steps';
import Link from 'next/link';

// =================================================================================================================================================================
// SUB-COMPONENTES
// =================================================================================================================================================================

function HelpMenu({ onStartTutorial }: { onStartTutorial: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer h-14 w-14">
          <AvatarFallback>
            <HelpCircle className="h-10 w-10" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="text-lg">Ayuda</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={onStartTutorial} className="text-lg">
          Iniciar Tour Guiado
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SettingsMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar id="settings-menu-button" className="cursor-pointer h-14 w-14">
          <AvatarFallback>
            <Settings className="h-10 w-10" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="text-lg">Ajustes</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="flex items-center justify-between">
          <span className="text-lg">Modo Oscuro</span>
          <ThemeSwitcher />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UserMenu({ onTutorialAction }: { onTutorialAction?: (action: TutorialAction) => void }) {
  const { user, loading } = useUser();

  const handleSignOut = async () => {
    await signOut(auth);
  };
  
  const handleClick = () => {
    if (onTutorialAction) {
      onTutorialAction('click');
    }
  }

  if (loading) {
    return <div className="h-14 w-14 animate-pulse rounded-full bg-gray-200" />;
  }

  if (!user) {
    return null;
  }

  const displayName = user.displayName || user.email || 'Usuario';
  const photoURL = user.photoURL || undefined;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar id="user-menu-button" className="cursor-pointer h-14 w-14" onClick={handleClick}>
          <AvatarImage src={photoURL} alt={displayName} />
          <AvatarFallback>
            <User className="h-10 w-10" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="text-lg">{displayName}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-lg">Cerrar Sesión</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// =================================================================================================================================================================
// COMPONENTE DE LA PÁGINA PRINCIPAL
// =================================================================================================================================================================
export default function Home() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [isCreateTaskOpen, setCreateTaskOpen] = useState(false);
  const [isTutorialOpen, setTutorialOpen] = useState(false);
  const [tutorialAction, setTutorialAction] = useState<TutorialAction | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  useEffect(() => {
    if (user) {
      setTutorialOpen(false);
      setTutorialAction(null);
    }
  }, [user]);

  const handleTutorialAction = (action: TutorialAction) => {
    setTutorialAction(action);
  };
  
  const openCreateTask = () => {
    setCreateTaskOpen(true);
    handleTutorialAction('click');
  }

  const handleTutorialClose = () => {
    setTutorialOpen(false);
    setTutorialAction(null);
  };

  const handleActionConsumed = () => {
    setTutorialAction(null);
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background">
        <div className="text-4xl font-semibold">Cargando...</div>
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-screen w-full flex-col bg-background">
        <header className="sticky top-0 z-20 flex h-20 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6 justify-between">
          <div className="flex items-center gap-4">
            <h1 className="font-headline text-5xl font-semibold">G-Task</h1>
            <Link href="https://github.com/gonzalezferrerx9/G-task.git" target="_blank" rel="noopener noreferrer">
              <Avatar className="cursor-pointer h-14 w-14">
                <AvatarFallback>
                  <Github className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Avatar id="create-task-button" className="cursor-pointer h-14 w-14" onClick={openCreateTask}>
              <AvatarFallback>
                <PlusSquare className="h-10 w-10" />
              </AvatarFallback>
            </Avatar>
            <HelpMenu onStartTutorial={() => setTutorialOpen(true)} />
            <SettingsMenu />
            <UserMenu onTutorialAction={handleTutorialAction} />
          </div>
        </header>
        <main className="flex-1 px-4 pb-4 md:px-6 md:pb-6 flex justify-center">
          <KanbanBoard 
            isCreateTaskOpen={isCreateTaskOpen}
            setCreateTaskOpen={setCreateTaskOpen}
            onTutorialAction={handleTutorialAction}
          />
        </main>
      </div>
       <InteractiveTutorial 
        steps={tutorialSteps} 
        isOpen={isTutorialOpen}
        onClose={handleTutorialClose}
        completedAction={tutorialAction}
        onActionConsumed={handleActionConsumed}
      />
    </>
  );
}
