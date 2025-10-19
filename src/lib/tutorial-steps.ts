// =================================================================================================================================================================
// CONFIGURACIÓN DE LOS PASOS DEL TUTORIAL
// =================================================================================================================================================================

// =================================================================================================================================================================
// DEFINICIONES DE TIPOS
// =================================================================================================================================================================
export type TutorialAction = 'click' | 'task-created' | 'drag-start';

export interface TutorialStep {
  elementId: string;
  title: string;
  description: string;
  action: TutorialAction;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
}

// =================================================================================================================================================================
// ARRAY DE PASOS DEL TUTORIAL
// =================================================================================================================================================================
export const tutorialSteps: TutorialStep[] = [
  {
    elementId: 'create-task-button',
    title: '1. Crea una Tarea',
    description: "Haz clic aquí para abrir el formulario y crear tu primera tarea.",
    action: 'click',
    side: 'bottom',
    align: 'end',
  },
  {
    elementId: 'create-task-dialog',
    title: '2. Personaliza tu Tarea',
    description: "Completa los detalles de tu nueva tarea para una mejor organización. Haz clic en 'Crear Tarea' cuando termines.",
    action: 'task-created',
    side: 'right',
    align: 'start',
  },
  {
    elementId: 'kanban-column-in-progress',
    title: '3. Inicia tu Tarea',
    description: '¡Genial! Ahora arrastra tu nueva tarea a esta columna para iniciar el temporizador.',
    action: 'drag-start',
    side: 'bottom',
    align: 'center',
  },
];
