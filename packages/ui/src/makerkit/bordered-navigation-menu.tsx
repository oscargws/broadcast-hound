'use client';

import { NavLink, useLocation } from '@remix-run/react';

import { Button } from '../shadcn/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '../shadcn/navigation-menu';
import { cn } from '../utils';
import { Trans } from './trans';

export function BorderedNavigationMenu(props: React.PropsWithChildren) {
  return (
    <NavigationMenu className={'h-full'}>
      <NavigationMenuList className={'relative h-full space-x-2'}>
        {props.children}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export function BorderedNavigationMenuItem(props: {
  path: string;
  label: string;
  end?: boolean | ((path: string) => boolean);
  active?: boolean;
}) {
  const currentPath = useLocation().pathname;
  const end =
    typeof props.end === 'function' ? props.end(currentPath) : props.end;

  return (
    <NavigationMenuItem>
      <Button asChild variant={'ghost'} className={'relative'}>
        <NavLink to={props.path} end={end}>
          {({ isActive }) => (
            <>
              <Trans i18nKey={props.label} defaults={props.label} />

              <span
                className={cn(
                  'absolute -bottom-2.5 left-0 hidden h-1 w-full bg-primary animate-in fade-in zoom-in-90',
                  {
                    block: isActive,
                  },
                )}
              />
            </>
          )}
        </NavLink>
      </Button>
    </NavigationMenuItem>
  );
}
