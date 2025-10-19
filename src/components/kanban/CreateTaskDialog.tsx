// =================================================================================================================================================================
// COMPONENTE: DIÁLOGO PARA CREAR TAREA
// =================================================================================================================================================================
'use client';

// =================================================================================================================================================================
// IMPORTACIONES
// =================================================================================================================================================================
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '../ui/textarea';
import type { Task } from '@/lib/types';
import { CalendarIcon, Clock } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { TimePicker } from '../ui/time-picker';

// =================================================================================================================================================================
// ESQUEMA DEL FORMULARIO (ZOD)
// =================================================================================================================================================================
const formSchema = z.object({
  title: z.string().min(1, { message: 'El título es obligatorio.' }),
  description: z.string().min(1, { message: 'La descripción es obligatoria.' }),
  deadline: z.date({ required_error: 'La fecha límite es obligatoria.' }),
  assignee: z.string().min(1, { message: 'La etiqueta es obligatoria.' }),
  time: z.string().optional(),
});

// =================================================================================================================================================================
// PROPIEDADES DEL COMPONENTE
// =================================================================================================================================================================
interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addTask: (task: Omit<Task, 'id' | 'order'>) => void;
}

// =================================================================================================================================================================
// COMPONENTE
// =================================================================================================================================================================
export function CreateTaskDialog({ open, onOpenChange, addTask }: CreateTaskDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      assignee: '',
      time: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const taskData: Omit<Task, 'id' | 'order'> = {
      ...values,
      columnId: 'todo',
      deadline: values.deadline.toISOString(),
    };

    addTask(taskData);
    form.reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent id="create-task-dialog" className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Crear una nueva tarea</DialogTitle>
          <DialogDescription className="text-base">Completa los detalles de tu nueva tarea.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Introduce el título de la tarea" {...field} className="border-2 border-black dark:border-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Añade más detalles sobre la tarea..." {...field} className="border-2 border-black dark:border-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha Límite</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal text-base border-2 border-black dark:border-white',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? format(field.value, 'PPP') : <span>Elige una fecha</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal text-base border-2 border-black dark:border-white',
                              !field.value && 'text-muted-foreground'
                            )}
                            type="button"
                          >
                            {field.value || <span>Selecciona la hora</span>}
                            <Clock className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <TimePicker value={field.value} onChange={field.onChange} />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <FormField
                control={form.control}
                name="assignee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Etiqueta</FormLabel>
                    <FormControl>
                      <Input placeholder="Introduce una etiqueta" {...field} className="border-2 border-black dark:border-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <DialogFooter>
              <Button type="submit" className="text-base">Crear Tarea</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
