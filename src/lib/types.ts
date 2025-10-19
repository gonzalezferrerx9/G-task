// =================================================================================================================================================================
// DEFINICIONES DE TIPOS GLOBALES
// =================================================================================================================================================================
export type Id = string;

export type Column = {
  id: Id;
  title: string;
  color: string;
  headerColor: string;
};

export type Task = {
  id: Id;
  columnId: Id;
  title: string;
  description?: string;
  deadline?: string;
  assignee?: string;
  time?: string;
  startTime?: number;
  elapsedTime?: number;
  order: number;
};
