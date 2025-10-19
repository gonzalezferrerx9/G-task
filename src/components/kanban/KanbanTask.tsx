// =================================================================================================================================================================
// COMPONENTE: TAREA KANBAN
// =================================================================================================================================================================
'use client';

// =================================================================================================================================================================
// IMPORTACIONES
// =================================================================================================================================================================
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Clock, Calendar, TimerIcon, Snowflake, Tag } from 'lucide-react';
import type { Task } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '../ui/badge';
import { formatInTimeZone } from 'date-fns-tz';
import { cn } from '@/lib/utils';
import { useEffect, useState, forwardRef } from 'react';

// =================================================================================================================================================================
// FUNCIONES AUXILIARES Y SUB-COMPONENTES
// =================================================================================================================================================================
function formatDuration(milliseconds: number): string | null {
    if (milliseconds < 0) return '00:00:00';
    if (milliseconds === 0) return '00:00:00';

    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
    const seconds = Math.floor((milliseconds / 1000) % 60);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function ActiveTimer({ startTime, elapsedTime = 0 }: { startTime: number; elapsedTime?: number }) {
  const [displayTime, setDisplayTime] = useState(elapsedTime + (Date.now() - startTime));

  useEffect(() => {
    const interval = setInterval(() => {
      const totalElapsed = elapsedTime + (Date.now() - startTime);
      setDisplayTime(totalElapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, elapsedTime]);
  
  const formattedTime = formatDuration(displayTime);
  if (!formattedTime) return null;

  return (
    <Badge variant="outline" className="flex items-center gap-1 text-base bg-white border-black text-black border-2">
      <TimerIcon className="h-3 w-3" />
      {formattedTime}
    </Badge>
  );
}

// =================================================================================================================================================================
// PROPIEDADES DEL COMPONENTE
// =================================================================================================================================================================
interface KanbanTaskProps {
  task: Task;
  color: string;
}

// =================================================================================================================================================================
// COMPONENTE
// =================================================================================================================================================================
export const KanbanTask = forwardRef<HTMLDivElement, KanbanTaskProps>(({ task, color }, ref) => {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
    disabled: false,
  });

  const style = {
    transition: transition || 'transform 250ms ease',
    transform: CSS.Transform.toString(transform),
  };
  
  const isFrozen = task.columnId === 'todo' && task.elapsedTime && task.elapsedTime > 0;
  const cursorClass = 'cursor-grab active:cursor-grabbing';

  if (isDragging) {
    return <div ref={setNodeRef} style={style} className="h-32 w-full bg-secondary rounded-lg opacity-50 border-2 border-primary" />;
  }

  return (
    <div ref={(node) => {
        setNodeRef(node);
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }} style={style} {...attributes} {...listeners}>
      <Card className={cn("hover:shadow-lg transition-shadow duration-200 border-2 border-black min-h-[150px] flex flex-col h-full", cursorClass, color)}>
        <div className="p-4">
          <h3 className="text-xl font-semibold dark:text-white">{task.title}</h3>
        </div>
        {task.description && (
          <div className="p-4 pt-0 overflow-hidden">
            <p className="text-xl text-gray-800 dark:text-gray-300 break-words break-all text-justify whitespace-pre-wrap">
              {task.description}
            </p>
          </div>
        )}
        <div className="p-4 mt-auto">
          <div className="flex flex-wrap items-center gap-2 text-muted-foreground justify-start">
              {isFrozen && (
                <Badge variant="outline" className="flex items-center gap-1 text-base bg-white text-black border-black border-2">
                    <Snowflake className="h-3 w-3 text-blue-400" />
                    Congelada
                </Badge>
              )}

              {task.columnId === 'in-progress' && task.startTime && (
                <ActiveTimer startTime={task.startTime} elapsedTime={task.elapsedTime} />
              )}
              
              {(task.columnId === 'done' || isFrozen) && task.elapsedTime && task.elapsedTime > 0 && (
                 <Badge variant="outline" className="flex items-center gap-1 text-base bg-white border-black text-black border-2">
                    <TimerIcon className="h-3 w-3" />
                    {formatDuration(task.elapsedTime)}
                </Badge>
              )}

              {task.time && (
                <Badge variant="outline" className="flex items-center gap-1 text-base bg-white border-black text-black border-2">
                  <Clock className="h-3 w-3" />
                  {task.time}
                </Badge>
              )}
              {task.deadline && (
                <Badge variant="outline" className="flex items-center gap-1 text-base bg-white border-black text-black border-2">
                  <Calendar className="h-3 w-3" />
                  {formatInTimeZone(new Date(task.deadline), 'UTC', 'MMM d')}
                </Badge>
              )}
              {task.assignee && (
                <Badge variant="outline" className="flex items-center gap-1 text-base bg-white border-black text-black border-2">
                    <Tag className="h-3 w-3" />
                    {task.assignee}
                </Badge>
              )}
            </div>
        </div>
      </Card>
    </div>
  );
});

KanbanTask.displayName = 'KanbanTask';
