import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, TextField, MenuItem, Button, Table, TableHead, TableRow, TableCell, TableBody, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { listTitleChanges, approveTitleChange, denyTitleChange, TitleChangeItem } from '../../services/adminService';

const TitleChanges: React.FC = () => {
  const [items, setItems] = useState<TitleChangeItem[]>([]);
  const [status, setStatus] = useState('Pending');
  const [selected, setSelected] = useState<TitleChangeItem | null>(null);
  const [denyOpen, setDenyOpen] = useState(false);
  const [denyReason, setDenyReason] = useState('');

  const load = async () => {
    const res = await listTitleChanges({ status });
    if (res.success) setItems(res.items);
  };

  useEffect(() => { load(); }, [status]);

  const handleApprove = async (id: string) => { await approveTitleChange(id); await load(); setSelected(null); };
  const handleDeny = async () => { if (selected) { await denyTitleChange(selected._id, denyReason); setDenyOpen(false); await load(); setSelected(null); setDenyReason(''); } };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Typography variant="h6">Filters</Typography>
          <TextField select size="small" label="Status" value={status} onChange={e => setStatus(e.target.value)}>
            {['Pending','Approved','Denied','Cancelled'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </TextField>
          <Button variant="outlined" onClick={load}>Refresh</Button>
        </Box>
      </Paper>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Project</TableCell>
              <TableCell>Old Title</TableCell>
              <TableCell>Requested Title</TableCell>
              <TableCell>Delta</TableCell>
              <TableCell>Requested At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map(it => (
              <TableRow key={it._id} hover onClick={() => setSelected(it)}>
                <TableCell>{it.userId}</TableCell>
                <TableCell>{it.projectId}</TableCell>
                <TableCell>{it.oldTitle}</TableCell>
                <TableCell>{it.newTitle}</TableCell>
                <TableCell>{it.similarityDelta}%</TableCell>
                <TableCell>{new Date(it.requestedAt).toLocaleString()}</TableCell>
                <TableCell>
                  {it.status === 'Pending' && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" variant="contained" onClick={(e) => { e.stopPropagation(); handleApprove(it._id); }}>Approve</Button>
                      <Button size="small" variant="outlined" color="error" onClick={(e) => { e.stopPropagation(); setSelected(it); setDenyOpen(true); }}>Deny</Button>
                    </Box>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={!!selected && !denyOpen} onClose={() => setSelected(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Title Change Details</DialogTitle>
        <DialogContent dividers>
          {selected && (
            <Box>
              <Typography variant="subtitle2">Old Title</Typography>
              <Typography sx={{ mb: 2 }}>{selected.oldTitle}</Typography>
              <Typography variant="subtitle2">Requested Title</Typography>
              <Typography sx={{ mb: 2 }}>{selected.newTitle}</Typography>
              <Typography variant="subtitle2">Similarity Delta</Typography>
              <Typography sx={{ mb: 2 }}>{selected.similarityDelta}%</Typography>
              <Typography variant="subtitle2">Requested At</Typography>
              <Typography sx={{ mb: 2 }}>{new Date(selected.requestedAt).toLocaleString()}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {selected?.status === 'Pending' && (
            <>
              <Button onClick={() => handleApprove(selected._id)} variant="contained">Approve</Button>
              <Button onClick={() => setDenyOpen(true)} color="error" variant="outlined">Deny</Button>
            </>
          )}
          <Button onClick={() => setSelected(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={denyOpen} onClose={() => setDenyOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Deny Title Change</DialogTitle>
        <DialogContent dividers>
          <TextField fullWidth label="Reason" value={denyReason} onChange={e => setDenyReason(e.target.value)} multiline minRows={3} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDenyOpen(false)}>Cancel</Button>
          <Button onClick={handleDeny} color="error" variant="contained">Deny</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TitleChanges;


