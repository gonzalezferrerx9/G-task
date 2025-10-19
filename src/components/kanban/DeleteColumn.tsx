// =================================================================================================================================================================
// COMPONENTE: ZONA DE ELIMINACIÓN
// =================================================================================================================================================================
'use client';

// =================================================================================================================================================================
// IMPORTACIONES
// =================================================================================================================================================================
import { useDroppable } from '@dnd-kit/core';
import { Trash } from 'lucide-react';

// =================================================================================================================================================================
// COMPONENTE
// =================================================================================================================================================================
export function DeleteColumn() {
  const { setNodeRef, isOver } = useDroppable({
    id: 'delete-zone',
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        w-full h-24 rounded-lg 
        flex flex-col items-center justify-center 
        transition-colors duration-200
        ${isOver ? 'bg-destructive/90 border-destructive' : 'bg-destructive/20 border-destructive/50'}
        border-2 border-dashed
      `}
    >
      <div className="flex flex-col items-center gap-2 text-destructive-foreground">
        <Trash className={`h-8 w-8 transition-transform duration-200 ${isOver ? 'scale-110' : ''}`} />
        <p className="text-md font-semibold">Arrastra aquí para eliminar</p>
      </div>
    </div>
  );
}
