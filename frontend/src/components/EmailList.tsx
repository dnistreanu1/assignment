import React from 'react';
import { List, ListItemButton, ListItemText } from '@mui/material';
import type { Email } from '../types';

type Props = {
  emails: Email[];
  selectedId: number | null;
  onSelect: (id: number) => void;
};

export function EmailList({ emails, selectedId, onSelect }: Props) {
  return (
    <List sx={{ width: 360, borderRight: '2px solid #eee', height: '100vh', overflowY: 'auto' }}>
      {emails.map((e) => (
        <ListItemButton key={e.id} selected={selectedId === e.id} onClick={() => onSelect(e.id)}>
          <ListItemText primary={e.subject} secondary={`${e.to}`} />
        </ListItemButton>
      ))}
    </List>
  );
}


