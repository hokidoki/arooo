import '@/styles/reset.scss';
import DefaultSeoConfig from '../../seo.config';
import { DefaultSeo } from 'next-seo';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';

export const queryClient = new QueryClient();
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo {...DefaultSeoConfig} />
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </>
  );
}
