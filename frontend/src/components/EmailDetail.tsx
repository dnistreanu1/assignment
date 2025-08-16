import React from 'react';
import { Box, Typography } from '@mui/material';
import type { Email } from '../types';

type Props = { email: Email | null };

export function EmailDetail({ email }: Props) {
  if (!email) {
    return (
      <Box sx={{ p: 3, flex: 1 }}>
        <Typography variant="h6">Select an email</Typography>
      </Box>
    );
  }
  return (
    <Box sx={{ p: 3, flex: 1, height: '100vh', overflowY: 'auto' }}>
      <Typography variant="subtitle2">To: {email.to}</Typography>
      {email.cc && <Typography variant="subtitle2">CC: {email.cc}</Typography>}
      {email.bcc && <Typography variant="subtitle2">BCC: {email.bcc}</Typography>}
      <Typography variant="h5" sx={{ mt: 2 }}>{email.subject}</Typography>
      <Typography sx={{ mt: 2, whiteSpace: 'pre-wrap' }}>{email.body}</Typography>
    </Box>
  );
}


