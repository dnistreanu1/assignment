import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import type { CreateEmailInput } from '../types';
import { createEmail, streamDraft } from '../api/client';

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

export function ComposeDialog({ open, onClose, onCreated }: Props) {
  const [to, setTo] = useState('');
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const stopRef = useRef<(() => void) | null>(null);
  const bufferRef = useRef('');
  const subjectCapturedRef = useRef(false);

  useEffect(() => {
    if (!open) {
      setTo(''); setCc(''); setBcc(''); setSubject(''); setBody(''); setPrompt('');
      if (stopRef.current) stopRef.current();
    }
  }, [open]);

  const canSave = useMemo(() => to && subject && body, [to, subject, body]);

  function startAI() {
    if (!prompt) return;
    setIsStreaming(true);
    setSubject('');
    setBody('');
    bufferRef.current = '';
    subjectCapturedRef.current = false;
    stopRef.current = streamDraft(prompt, ({ decision, text, done }) => {
      if (decision) {
        // could display somewhere if wanted
      }
      if (text) {
        // accumulate chunks and split subject (first line) from body when newline appears
        let buffer = bufferRef.current + text;
        if (!subjectCapturedRef.current) {
          const newlineIndex = buffer.indexOf('\n');
          if (newlineIndex !== -1) {
            const firstLine = buffer.slice(0, newlineIndex).trim();
            const subjectLine = firstLine.replace(/^Subject:\s*/i, '');
            setSubject(subjectLine);
            subjectCapturedRef.current = true;
            buffer = buffer.slice(newlineIndex + 1);
          } else {
            bufferRef.current = buffer;
            return;
          }
        }
        // append any remaining buffer to body as-is (no forced newlines)
        if (buffer) {
          setBody((prev) => prev + buffer);
          bufferRef.current = '';
        }
      }
      if (done) {
        // flush any remaining buffer
        const remaining = bufferRef.current;
        if (remaining) {
          if (!subjectCapturedRef.current) {
            setSubject(remaining.replace(/^Subject:\s*/i, ''));
          } else {
            setBody((prev) => prev + remaining);
          }
          bufferRef.current = '';
        }
        setIsStreaming(false);
      }
    });
  }

  async function handleSave() {
    const payload: CreateEmailInput = { to, cc: cc || null, bcc: bcc || null, subject, body };
    await createEmail(payload);
    onCreated();
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" >
      <DialogTitle>Compose</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1, }}>
          <TextField label="To" value={to} onChange={(e) => setTo(e.target.value)} fullWidth />
          <Stack direction="row" spacing={2}>
            <TextField label="CC" value={cc} onChange={(e) => setCc(e.target.value)} sx={{ flex: 1, minWidth: 0 }} />
            <TextField label="BCC" value={bcc} onChange={(e) => setBcc(e.target.value)} sx={{ flex: 1, minWidth: 0 }} />
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <TextField label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} sx={{ flex: 1, minWidth: 0 }} />
            <Tooltip title={isStreaming ? 'Generating…' : 'AI ✨'}>
              <span>
                <IconButton color="primary" onClick={startAI} disabled={isStreaming || !prompt} aria-busy={isStreaming}>
                  {isStreaming ? <CircularProgress size={20} /> : <AutoAwesomeIcon />}
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
          <TextField label="Body" value={body} onChange={(e) => setBody(e.target.value)} fullWidth multiline minRows={8} />
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <TextField label="Describe your email (router decides)" value={prompt} onChange={(e) => setPrompt(e.target.value)} sx={{ flex: 1, minWidth: 0 }} />
            <Button onClick={startAI} disabled={isStreaming || !prompt} variant="outlined" startIcon={isStreaming ? <CircularProgress size={16} /> : undefined} aria-busy={isStreaming}>
              {isStreaming ? 'Generating…' : 'AI ✨'}
            </Button>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} disabled={!canSave} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
}


