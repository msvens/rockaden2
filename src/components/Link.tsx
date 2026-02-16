'use client';

import NextLink from 'next/link';
import { ReactNode, MouseEvent } from 'react';

export interface LinkProps {
  href: string;
  children: ReactNode;
  color?: 'blue' | 'inherit' | 'gray';
  underline?: 'always' | 'hover' | 'never';
  className?: string;
  title?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  external?: boolean;
}

export function Link({
  href,
  children,
  color = 'blue',
  underline = 'hover',
  className = '',
  title,
  onClick,
  external = false,
}: LinkProps) {
  const colorClasses = {
    blue: 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300',
    inherit: 'text-gray-900 dark:text-gray-200 hover:text-gray-700 dark:hover:text-gray-300',
    gray: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
  };

  const underlineClasses = {
    always: 'underline',
    hover: 'hover:underline',
    never: 'no-underline',
  };

  const combinedClassName =
    `${colorClasses[color]} ${underlineClasses[underline]} transition-colors ${className}`.trim();

  const externalProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <NextLink href={href} className={combinedClassName} title={title} onClick={onClick} {...externalProps}>
      {children}
    </NextLink>
  );
}
