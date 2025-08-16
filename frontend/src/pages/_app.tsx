import * as React from 'react';
import '../styles/globals.css';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme();

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}


