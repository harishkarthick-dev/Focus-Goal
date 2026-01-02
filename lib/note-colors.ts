export const noteColorMap: Record<string, string> = {
  white: 'bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800',
  red: 'bg-red-100 border-red-200 dark:bg-red-900/20 dark:border-red-900/50',
  orange: 'bg-orange-100 border-orange-200 dark:bg-orange-900/20 dark:border-orange-900/50',
  yellow: 'bg-yellow-100 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-900/50',
  green: 'bg-green-100 border-green-200 dark:bg-green-900/20 dark:border-green-900/50',
  teal: 'bg-teal-100 border-teal-200 dark:bg-teal-900/20 dark:border-teal-900/50',
  blue: 'bg-blue-100 border-blue-200 dark:bg-blue-900/20 dark:border-blue-900/50',
  purple: 'bg-purple-100 border-purple-200 dark:bg-purple-900/20 dark:border-purple-900/50',
  pink: 'bg-pink-100 border-pink-200 dark:bg-pink-900/20 dark:border-pink-900/50',
};

export const noteColors = Object.keys(noteColorMap);

export const getNoteColor = (color: string) => noteColorMap[color] || noteColorMap['white'];
