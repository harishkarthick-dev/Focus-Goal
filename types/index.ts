export type Priority = 'low' | 'medium' | 'high';
export type SyncStatus = 'synced' | 'pending' | 'error';
export type Theme = 'light' | 'dark' | 'system';
export type TaskListType = 'inbox' | 'my-day' | string;

export interface User {
  id: string;
  email: string;
  displayName?: string;
  theme: Theme;
  createdAt: number;
  subscriptionTier: 'free' | 'pro' | 'early-access';
  provider?: string;
  photoURL?: string;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  userId: string;
  parentId?: string;
  title: string;
  completed: boolean;
  priority: Priority;
  dueDate?: number | null;
  repeat?: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  listId: TaskListType;
  goalId?: string | null;
  steps: SubTask[];
  note?: string;
  isMyDay: boolean;
  order: number;
  isDeleted: boolean;
  createdAt: number;
  updatedAt: number;
  completedAt?: number;
  syncStatus?: SyncStatus;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  type: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  startDate: number;
  endDate: number;
  completedAt?: number;
  color?: string;
  createdAt: number;
  updatedAt: number;
  isDeleted: boolean;
}

export interface Note {
  id: string;
  userId: string;
  taskId?: string;
  title: string;
  content: Record<string, unknown>;
  textPreview?: string;
  color: string;
  isChecklist: boolean;
  pinned: boolean;
  archived: boolean;
  tags: string[];
  createdAt: number;
  updatedAt: number;
  isDeleted: boolean;
}

export interface SyncOperation {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  entity: 'TASK' | 'GOAL' | 'NOTE';
  entityId: string;
  payload: Record<string, unknown>;
  timestamp: number;
  retryCount: number;
}
