import { cva, type VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';
import { Pressable, Text, type PressableProps } from 'react-native';

import { cn } from '@/lib/cn';

const button = cva('flex-row items-center justify-center gap-2 rounded-2xl active:opacity-80', {
  variants: {
    variant: {
      primary: 'bg-accent',
      secondary: 'bg-surface border border-border',
      ghost: 'bg-transparent',
    },
    size: {
      md: 'px-4 py-3',
      icon: 'h-11 w-11',
    },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
});

const label = cva('text-base font-semibold', {
  variants: {
    variant: {
      primary: 'text-accent-foreground',
      secondary: 'text-foreground',
      ghost: 'text-foreground',
    },
  },
  defaultVariants: { variant: 'primary' },
});

interface ButtonProps extends PressableProps, VariantProps<typeof button> {
  children?: ReactNode;
  /** Text label; when provided it is styled per variant. */
  title?: string;
  className?: string;
}

export function Button({ variant, size, title, children, className, ...props }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      className={cn(button({ variant, size }), className)}
      {...props}>
      {title ? <Text className={label({ variant })}>{title}</Text> : children}
    </Pressable>
  );
}
