// =================================================================================================================================================================
// COMPONENTE: COLUMNA KANBAN
// =================================================================================================================================================================
'use client';

// =================================================================================================================================================================
// IMPORTACIONES
// =================================================================================================================================================================
import { useMemo, MutableRefObject } from 'react';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import type { Column, Task, Id } from '@/lib/types';
import { KanbanTask } from './KanbanTask';
import { Card, CardContent, CardHeader } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '@/lib/utils';

// =================================================================================================================================================================
// PROPIEDADES DEL COMPONENTE
// =================================================================================================================================================================
interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  taskRefs: MutableRefObject<Map<Id, HTMLDivElement | null>>;
}

// =================================================================================================================================================================
// COMPONENTE
// =================================================================================================================================================================
export function KanbanColumn({ column, tasks, taskRefs }: KanbanColumnProps) {
  const tasksIds = useMemo(() => tasks.map(task => task.id), [tasks]);

  const { setNodeRef, isDragging } = useSortable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
    disabled: true,
  });

  const columnColorMapping: { [key: string]: { header: string; task: string } } = {
    todo: { header: 'bg-blue-800 text-white', task: 'bg-blue-100' },
    'in-progress': { header: 'bg-yellow-500 text-white', task: 'bg-yellow-100' },
    done: { header: 'bg-green-600 text-white', task: 'bg-green-100' },
  };
  
  const darkColumnColorMapping: { [key: string]: { task: string } } = {
    todo: { task: 'dark:bg-blue-900/50' },
    'in-progress': { task: 'dark:bg-yellow-900/50' },
    done: { task: 'dark:bg-green-900/50' },
  };

  const defaultColor = { header: 'bg-gray-800 text-white', task: 'bg-gray-100' };
  const colors = columnColorMapping[column.id.toString()] || defaultColor;
  const darkColors = darkColumnColorMapping[column.id.toString()] || { task: 'dark:bg-gray-900/50' };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        className="w-full md:w-1/3 flex-shrink-0 h-[500px] bg-secondary rounded-lg opacity-40 border-2 border-primary"
      />
    );
  }

  return (
    <div ref={setNodeRef} className="w-full md:w-1/3 flex-shrink-0" id={`kanban-column-${column.id}`}>
      <Card className={'h-[500px] flex flex-col border-black border-2 rounded-lg'}>
        <CardHeader
          className={cn(
            'p-4 font-semibold border-b flex flex-row items-center justify-between',
            colors.header,
            'dark:text-white'
          )}
        >
          <span
            className="font-headline text-2xl"
            style={{ textShadow: '0px 0px 1px black, 0px 0px 1px black' }}
          >
            {column.title}
          </span>
        </CardHeader>
        <ScrollArea className="flex-1 bg-secondary/60">
           <div className="p-4 flex flex-col gap-4">
              <SortableContext items={tasksIds}>
                {tasks.map(task => (
                  <KanbanTask
                    key={task.id}
                    task={task}
                    color={cn(colors.task, darkColors.task)}
                    ref={node => taskRefs.current.set(task.id, node)}
                  />
                ))}
              </SortableContext>
           </div>
        </ScrollArea>
      </Card>
    </div>
  );
}
