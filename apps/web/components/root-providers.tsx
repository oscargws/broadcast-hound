import { Suspense, useMemo } from 'react';

import { ThemeProvider } from 'next-themes';

import { CaptchaProvider, CaptchaTokenSetter } from '@kit/auth/captcha/client';
import { I18nProvider } from '@kit/i18n/provider';
import { MonitoringProvider } from '@kit/monitoring/components';
import { useAuthChangeListener } from '@kit/supabase/hooks/use-auth-change-listener';
import { ClientOnly } from '@kit/ui/client-only';
import { GlobalLoader } from '@kit/ui/global-loader';
import { Toaster } from '@kit/ui/sonner';

import authConfig from '~/config/auth.config';
import pathsConfig from '~/config/paths.config';
import { i18nResolver } from '~/lib/i18n/i18n.resolver';
import { getI18nSettings } from '~/lib/i18n/i18n.settings';

import { ReactQueryProvider } from './react-query-provider';

const captchaSiteKey = authConfig.captchaTokenSiteKey;

export function RootProviders(
  props: React.PropsWithChildren<{
    theme: string;
    language: string;
  }>,
) {
  const settings = useMemo(
    () => getI18nSettings(props.language),
    [props.language],
  );

  return (
    <Suspense>
      <I18nProvider settings={settings} resolver={i18nResolver}>
        <Toaster
          richColors={false}
          toastOptions={{
            classNames: {
              error: 'bg-red-400',
              success: 'text-green-400',
              warning: 'text-yellow-400',
              info: 'bg-blue-400',
            },
          }}
        />
        <ClientOnly>
          <GlobalLoader displaySpinner={false} />
        </ClientOnly>
        <ReactQueryProvider>
          <MonitoringProvider>
            <CaptchaProvider>
              <CaptchaTokenSetter siteKey={captchaSiteKey} />
              <AuthProvider>{props.children}</AuthProvider>
            </CaptchaProvider>
          </MonitoringProvider>
        </ReactQueryProvider>
      </I18nProvider>
    </Suspense>
  );
}

// we place this below React Query since it uses the QueryClient
function AuthProvider(props: React.PropsWithChildren) {
  useAuthChangeListener({
    appHomePath: pathsConfig.app.home,
  });

  return props.children;
}
