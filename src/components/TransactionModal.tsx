import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  Typography,
} from '@mui/material';
import { useGetUsersMutation, useCreateTransactionMutation } from '../services/apiSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface TransactionModalProps {
  open: boolean;
  onClose: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ open, onClose }) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const [getUsers] = useGetUsersMutation();
  const [createTransaction] = useCreateTransactionMutation();
  const [recipientQuery, setRecipientQuery] = useState<string>('');
  const [recipientOptions, setRecipientOptions] = useState<any[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<any | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (recipientQuery.length > 0) {
      getUsers({ filter: recipientQuery, token })
        .unwrap()
        .then(setRecipientOptions)
        .catch(() => setRecipientOptions([]));
    }
  }, [recipientQuery, getUsers, token]);

  const handleSubmit = async () => {
    setError('');
    const txAmount = parseFloat(amount);
    if (isNaN(txAmount) || txAmount <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    if (!selectedRecipient) {
      setError('Please select a recipient.');
      return;
    }

    try {
      await createTransaction({ name: selectedRecipient.name, amount: txAmount, token }).unwrap();
      onClose();
    } catch {
      setError('Transaction failed.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>New Transaction</DialogTitle>
      <DialogContent>
        {error && <Typography color="error">{error}</Typography>}
        <Autocomplete
          value={selectedRecipient}
          onChange={(event, newValue) => setSelectedRecipient(newValue)}
          inputValue={recipientQuery}
          onInputChange={(event, newInputValue) => setRecipientQuery(newInputValue)}
          options={recipientOptions}
          getOptionLabel={(option) => option.name || ""}
          renderInput={(params) => <TextField {...params} label="Recipient" fullWidth required />}
        />
        <TextField
          label="Amount"
          variant="outlined"
          fullWidth
          margin="normal"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransactionModal;
