import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn utility', () => {
  it('should merge class names', () => {
    const result = cn('class1', 'class2');
    expect(result).toContain('class1');
    expect(result).toContain('class2');
  });

  it('should handle conditional classes', () => {
    const condition = true;
    const result = cn('base', condition && 'conditional');
    expect(result).toContain('base');
    expect(result).toContain('conditional');
  });

  it('should filter out falsy values', () => {
    const result = cn('base', false && 'excluded', undefined, null, 'included');
    expect(result).toContain('base');
    expect(result).toContain('included');
    expect(result).not.toContain('excluded');
  });

  it('should handle empty input', () => {
    const result = cn();
    expect(result).toBe('');
  });

  it('should merge Tailwind classes correctly', () => {
    const result = cn('px-2', 'px-4');

    expect(result).toBe('px-4');
  });
});
