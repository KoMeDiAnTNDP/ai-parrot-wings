// src/components/Home.tsx
import React, { useState, useContext, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Autocomplete,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import { UserContext } from '../UserContext';
import { getUsersList, createTransaction, getTransactionHistory, UserItem, Transaction } from '../api';

const Home: React.FC = () => {
  const { user, setUser } = useContext(UserContext);
  const [recipientQuery, setRecipientQuery] = useState<string>('');
  const [recipientOptions, setRecipientOptions] = useState<UserItem[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<UserItem | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [transactionError, setTransactionError] = useState<string>('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Fetch transaction history on mount.
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    if (!user) return;
    try {
      const history = await getTransactionHistory(user.token);
      setTransactions(history);
    } catch (err) {
      console.error("Failed to fetch transaction history", err);
    }
  };

  // Fetch recipient suggestions when the query changes.
  useEffect(() => {
    if (recipientQuery.length > 0) {
      fetchUsers(recipientQuery);
    } else {
      setRecipientOptions([]);
    }
  }, [recipientQuery]);

  const fetchUsers = async (query: string) => {
    if (!user) return;
    try {
      const users = await getUsersList(query);
      // Optionally, filter out the current user.
      const filtered = users.filter(u => u.name !== user.name);
      setRecipientOptions(filtered);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const handleTransactionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTransactionError('');

    const txAmount = parseFloat(amount);
    if (isNaN(txAmount) || txAmount <= 0) {
      setTransactionError("Please enter a valid amount.");
      return;
    }

    if (!user || txAmount > user.balance) {
      setTransactionError("Transaction amount exceeds your current balance.");
      return;
    }

    if (!selectedRecipient) {
      setTransactionError("Please select a recipient.");
      return;
    }

    try {
      const transactionData = {
        recipientId: selectedRecipient.id,
        recipientName: selectedRecipient.name,
        amount: txAmount
      };

      const res = await createTransaction(user.token, transactionData);
      if (res.success) {
        setUser({ ...user, balance: res.newBalance });
        setTransactions(prev => [res.transaction, ...prev]);
        // Reset the form.
        setSelectedRecipient(null);
        setRecipientQuery('');
        setAmount('');
      } else {
        setTransactionError("Transaction failed.");
      }
    } catch (err) {
      setTransactionError("Transaction failed.");
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5">Welcome, {user?.name}</Typography>
        <Typography variant="h6">Current PW Balance: {user?.balance}</Typography>
      </Box>

      <Box sx={{ mt: 4, p: 2, border: "1px solid #ccc", borderRadius: "8px" }}>
        <Typography variant="h6">New Transaction</Typography>
        {transactionError && <Typography color="error">{transactionError}</Typography>}
        <form onSubmit={handleTransactionSubmit}>
          <Autocomplete
            value={selectedRecipient}
            onChange={(event, newValue) => setSelectedRecipient(newValue)}
            inputValue={recipientQuery}
            onInputChange={(event, newInputValue) => setRecipientQuery(newInputValue)}
            options={recipientOptions}
            getOptionLabel={(option) => option.name || ""}
            renderInput={(params) => (
              <TextField {...params} label="Recipient" variant="outlined" margin="normal" required />
            )}
            sx={{ mt: 2 }}
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
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Send PW
          </Button>
        </form>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Transaction History</Typography>
        {transactions.length === 0 ? (
          <Typography>No transactions found.</Typography>
        ) : (
          <List>
            {transactions.map((tx, index) => (
              <React.Fragment key={index}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={`${tx.date} - ${tx.correspondent}`}
                    secondary={
                      <>
                        <Typography variant="body2" color={tx.amount < 0 ? "error" : "primary"}>
                          {tx.amount < 0 ? "Debit" : "Credit"}: {tx.amount}
                        </Typography>
                        <Typography variant="body2">
                          Resulting Balance: {tx.balance}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>
    </Container>
  );
};

export default Home;
