import React, { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { Box, Fab, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { EmailList } from '../components/EmailList';
import { EmailDetail } from '../components/EmailDetail';
import { ComposeDialog } from '../components/ComposeDialog';
import type { Email } from '../types';
import { deleteAllEmails, listEmails } from '../api/client';

export default function HomePage() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  async function refresh() {
    const items = await listEmails();
    setEmails(items);
    if (items.length && !selectedId) setSelectedId(items[0].id);
  }

  useEffect(() => {
    refresh();
  }, []);

  const selectedEmail = useMemo(() => emails.find((e) => e.id === selectedId) || null, [emails, selectedId]);

  return (
    <>
      <Head>
        <title>Emails</title>
      </Head>
      <Box sx={{ display: 'flex' }}>
        <EmailList emails={emails} selectedId={selectedId} onSelect={setSelectedId} />
        <EmailDetail email={selectedEmail} />
      </Box>
      <Box sx={{ position: 'fixed', right: 24, bottom: 24, display: 'flex', gap: 1 }}>
      <Tooltip title="Delete all emails" sx={{marginRight: '16px'}}>
          <Fab color="error" onClick={async () => {
            const confirmed = window.confirm('Delete all emails? This cannot be undone.');
            if (!confirmed) return;
            await deleteAllEmails();
            setSelectedId(null);
            await refresh();
          }}>
            <DeleteSweepIcon />
          </Fab>
        </Tooltip>
        <Tooltip title="Compose">
          <Fab color="primary" onClick={() => setOpen(true)}>
            <AddIcon />
          </Fab>
        </Tooltip>
      </Box>
      <ComposeDialog open={open} onClose={() => setOpen(false)} onCreated={refresh} />
    </>
  );
}


