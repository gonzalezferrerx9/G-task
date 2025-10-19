// =================================================================================================================================================================
// COMPONENTE: TABLERO KANBAN
// =================================================================================================================================================================
'use client';

// =================================================================================================================================================================
// IMPORTACIONES
// =================================================================================================================================================================
import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragOverlay,
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { initialColumns } from '@/lib/data';
import type { Column, Id, Task } from '@/lib/types';
import { KanbanColumn } from './KanbanColumn';
import { KanbanTask } from './KanbanTask';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useUser } from '@/hooks/use-user';
import { useCollection } from '@/firebase/firestore/use-collection';
import { db } from '@/firebase/config';
import { collection, doc, setDoc, writeBatch, deleteDoc } from 'firebase/firestore';
import { DeleteColumn } from './DeleteColumn';
import { CreateTaskDialog } from './CreateTaskDialog';
import { TutorialAction } from '@/lib/tutorial-steps';

// =================================================================================================================================================================
// DEFINICIONES DE TIPOS
// =================================================================================================================================================================
type MoveConfirmation = {
  task: Task;
  targetColumnId: Id;
} | null;

interface KanbanBoardProps {
  isCreateTaskOpen: boolean;
  setCreateTaskOpen: (isOpen: boolean) => void;
  onTutorialAction?: (action: TutorialAction) => void;
}

// =================================================================================================================================================================
// COMPONENTE
// =================================================================================================================================================================
export default function KanbanBoard({ isCreateTaskOpen, setCreateTaskOpen, onTutorialAction }: KanbanBoardProps) {
  const { user } = useUser();
  const tasksCollection = useMemo(() => {
    if (!user) return null;
    return collection(db, 'users', user.uid, 'tasks');
  }, [user]);

  const { data: serverTasks, loading: tasksLoading } = useCollection(tasksCollection);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [columns] = useState<Column[]>(initialColumns);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [moveConfirmation, setMoveConfirmation] = useState<MoveConfirmation>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<Task | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [overlayWidth, setOverlayWidth] = useState<number | null>(null);
  const taskRefs = useRef<Map<Id, HTMLDivElement | null>>(new Map());

  const columnsId = useMemo(() => columns.map(col => col.id), [columns]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  useEffect(() => {
    if (serverTasks) {
        const sortedTasks = [...serverTasks].sort((a, b) => a.order - b.order);
        setTasks(sortedTasks as Task[]);
    }
  }, [serverTasks]);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const deleteTask = useCallback(async (taskId: Id) => {
    if (!user) return;
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    const taskDocRef = doc(db, 'users', user.uid, 'tasks', taskId.toString());
    await deleteDoc(taskDocRef);
  }, [user]);

  const updateTask = useCallback(async (task: Task) => {
    if (!user) return;
    const taskDocRef = doc(db, 'users', user.uid, 'tasks', task.id.toString());
    await setDoc(taskDocRef, task, { merge: true });
  }, [user]);
  
  const addTask = useCallback(async (task: Omit<Task, 'id' | 'order'>) => {
    if (!user) return;
    const taskId = `task-${crypto.randomUUID()}`;
    const newOrder = tasks.length;
    const newTask: Task = { 
      ...task, 
      id: taskId, 
      order: newOrder,
      deadline: task.deadline ? task.deadline : undefined,
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
    const taskDocRef = doc(db, 'users', user.uid, 'tasks', taskId);
    await setDoc(taskDocRef, newTask);
    onTutorialAction?.('task-created');
  }, [user, tasks, onTutorialAction]);

  const handleConfirmMove = () => {
    if (!moveConfirmation) return;
    const { task, targetColumnId } = moveConfirmation;
  
    const newTasks = [...tasks];
    const taskIndex = newTasks.findIndex((t) => t.id === task.id);
    if (taskIndex === -1) {
      setMoveConfirmation(null);
      return;
    }
  
    const updatedTask = { ...newTasks[taskIndex] };
    updatedTask.columnId = targetColumnId;
  
    if (updatedTask.startTime) {
      const sessionTime = Date.now() - updatedTask.startTime;
      updatedTask.elapsedTime = (updatedTask.elapsedTime || 0) + sessionTime;
      delete updatedTask.startTime;
    }
  
    newTasks[taskIndex] = updatedTask;
  
    setTasks(newTasks);
    updateTask(updatedTask);
    setMoveConfirmation(null);
  };
  
  const handleCancelMove = () => setMoveConfirmation(null);
  const handleConfirmDelete = () => {
    if (deleteConfirmation) {
      deleteTask(deleteConfirmation.id);
      setDeleteConfirmation(null);
    }
  };
  const handleCancelDelete = () => setDeleteConfirmation(null);

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === 'Task') {
      const task = event.active.data.current.task;
      setActiveTask(task);
      const taskNode = taskRefs.current.get(task.id);
      if (taskNode) {
        setOverlayWidth(taskNode.offsetWidth);
      }
      onTutorialAction?.('drag-start');
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveTask(null);
    setOverlayWidth(null);
  
    const { active, over } = event;
    if (!over) return;
  
    const activeId = active.id;
    const overId = over.id;
  
    if (activeId === overId) return;
  
    const activeTaskData = tasks.find((t) => t.id === activeId);
    if (!activeTaskData) return;
  
    if (over.id === 'delete-zone') {
      setDeleteConfirmation(activeTaskData);
      return;
    }
  
    const overIsColumn = over.data.current?.type === 'Column';
    const overIsTask = over.data.current?.type === 'Task';
  
    let overColumnId: Id;
    if (overIsColumn) {
      overColumnId = over.id;
    } else if (overIsTask) {
      overColumnId = over.data.current.task.columnId;
    } else {
      const overTaskData = tasks.find((t) => t.id === overId);
      if (!overTaskData) return;
      overColumnId = overTaskData.columnId;
    }
  
    if (activeTaskData.columnId === 'done' && overColumnId !== 'done') {
      return;
    }
  
    if (activeTaskData.columnId !== 'done' && overColumnId === 'done') {
      setMoveConfirmation({ task: activeTaskData, targetColumnId: overColumnId });
      return;
    }
  
    let newTasks = [...tasks];
    const activeIndex = newTasks.findIndex((t) => t.id === activeId);
  
    if (activeTaskData.columnId === overColumnId) {
      const overIndex = newTasks.findIndex((t) => t.id === overId);
      if (activeIndex !== -1 && overIndex !== -1) {
        newTasks = arrayMove(newTasks, activeIndex, overIndex);
      }
    } else {
      const activeTaskInNewTasks = { ...newTasks[activeIndex], columnId: overColumnId };
      
      if (overColumnId === 'in-progress') {
        activeTaskInNewTasks.startTime = Date.now();
      } else if (activeTaskInNewTasks.startTime) {
        const sessionTime = Date.now() - activeTaskInNewTasks.startTime;
        activeTaskInNewTasks.elapsedTime = (activeTaskInNewTasks.elapsedTime || 0) + sessionTime;
        delete activeTaskInNewTasks.startTime;
      }
      
      newTasks.splice(activeIndex, 1);
      
      const overIndex = newTasks.findIndex((t) => t.id === overId);
      if (overIndex !== -1) {
        newTasks.splice(overIndex, 0, activeTaskInNewTasks);
      } else {
        const tasksInOverColumn = newTasks.filter(t => t.columnId === overColumnId);
        const lastTaskIndexInOverColumn = tasksInOverColumn.length > 0 
          ? newTasks.lastIndexOf(tasksInOverColumn[tasksInOverColumn.length - 1]) 
          : -1;
        newTasks.splice(lastTaskIndexInOverColumn + 1, 0, activeTaskInNewTasks);
      }
    }
  
    const finalTasks = newTasks.map((t, index) => ({ ...t, order: index }));
    setTasks(finalTasks);
  
    if (user) {
      const batch = writeBatch(db);
      finalTasks.forEach((t) => {
        const taskRef = doc(db, 'users', user.uid, 'tasks', t.id.toString());
        batch.set(taskRef, t, { merge: true });
      });
      batch.commit().catch(console.error);
    }
  }
  
  if (!isClient || (tasksLoading && tasks.length === 0 && serverTasks?.length !== 0)) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-background items-center justify-center">
          <div className="text-xl font-semibold">Cargando Tablero...</div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      collisionDetection={closestCenter}
    >
      <div className="flex flex-col h-full w-full">
        <div className="flex flex-col md:flex-row gap-4">
          <SortableContext items={columnsId}>
            {columns.map(col => (
              <KanbanColumn
                key={col.id}
                column={col}
                tasks={tasks.filter(task => task.columnId === col.id)}
                taskRefs={taskRefs}
              />
            ))}
          </SortableContext>
        </div>

        {activeTask && (
          <div className="mt-8">
            <DeleteColumn />
          </div>
        )}
      </div>

      <CreateTaskDialog 
        open={isCreateTaskOpen}
        onOpenChange={setCreateTaskOpen}
        addTask={addTask}
      />

      {isClient && createPortal(
        <DragOverlay>
          {activeTask && (
             <div style={{ width: overlayWidth ? `${overlayWidth}px` : 'auto' }}>
              <KanbanTask
                task={activeTask}
                color={columns.find(col => col.id === activeTask.columnId)?.color || ''}
              />
            </div>
          )}
        </DragOverlay>,
        document.body
      )}

      <AlertDialog open={!!moveConfirmation} onOpenChange={() => setMoveConfirmation(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Confirmar Mover a "Hecho"</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              ¿Estás seguro de que quieres marcar la tarea "{moveConfirmation?.task.title}" como hecha? Este proceso no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelMove}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmMove}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={!!deleteConfirmation} onOpenChange={() => setDeleteConfirmation(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Confirmar Eliminación</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              ¿Estás seguro de que quieres eliminar la tarea "{deleteConfirmation?.title}"? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DndContext>
  );
}
