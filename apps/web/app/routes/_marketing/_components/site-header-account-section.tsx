import type { User } from '@supabase/supabase-js';

import { Link } from '@remix-run/react';
import { ChevronRight } from 'lucide-react';

import { PersonalAccountDropdown } from '@kit/accounts/personal-account-dropdown';
import { useSignOut } from '@kit/supabase/hooks/use-sign-out';
import { useUser } from '@kit/supabase/hooks/use-user';
import { Button } from '@kit/ui/button';
import { If } from '@kit/ui/if';
import { ModeToggle } from '@kit/ui/mode-toggle';
import { Trans } from '@kit/ui/trans';

import featuresFlagConfig from '~/config/feature-flags.config';
import pathsConfig from '~/config/paths.config';

const paths = {
  settings: pathsConfig.app.personalAccountSettings,
};

const features = {
  enableThemeToggle: featuresFlagConfig.enableThemeToggle,
};

export function SiteHeaderAccountSection({
  user,
}: React.PropsWithChildren<{
  user: User | null;
}>) {
  if (!user) {
    return <AuthButtons />;
  }

  return <SuspendedPersonalAccountDropdown user={user} />;
}

function SuspendedPersonalAccountDropdown(props: { user: User | null }) {
  const signOut = useSignOut();
  const user = useUser(props.user);
  const userData = user.data ?? props.user ?? null;

  if (userData) {
    return (
      <PersonalAccountDropdown
        paths={paths}
        features={features}
        user={userData}
        signOutRequested={() => signOut.mutateAsync()}
      />
    );
  }

  return <AuthButtons />;
}

function AuthButtons() {
  const textClassName =
    'text-gray-600 hover:text-current dark:text-gray-400 dark:hover:text-white';

  return (
    <div className={'flex space-x-2'}>
      <div className={'hidden space-x-0.5 md:flex'}>
        <If condition={features.enableThemeToggle}>
          <ModeToggle className={textClassName} />
        </If>

        <Button asChild variant={'ghost'} className={textClassName}>
          <Link to={pathsConfig.auth.signIn}>
            <Trans i18nKey={'auth:signIn'} />
          </Link>
        </Button>
      </div>

      <Button asChild className="group" variant={'default'}>
        <Link to={pathsConfig.auth.signUp}>
          <Trans i18nKey={'auth:signUp'} />

          <ChevronRight
            className={
              'ml-1 h-4 w-4 transition-transform duration-500 group-hover:translate-x-1'
            }
          />
        </Link>
      </Button>
    </div>
  );
}
