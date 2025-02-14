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
import {
  getUserInfo,
  getUsersList,
  createTransaction,
  getTransactions,
  UserInfoResponse,
  GetUsersResponse,
  CreateTransactionRequest,
  CreateTransactionResponse,
  GetTransactionsResponse,
  UserItem,
  Transaction,
} from '../api';

const Home: React.FC = () => {
  const { user } = useContext(UserContext);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [recipientQuery, setRecipientQuery] = useState<string>('');
  const [recipientOptions, setRecipientOptions] = useState<UserItem[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<UserItem | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [transactionError, setTransactionError] = useState<string>('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Fetch user info on mount.
  useEffect(() => {
    if (user?.token) {
      getUserInfo(user.token)
        .then((data: UserInfoResponse) => setUserInfo(data.user_info_token))
        .catch(err => console.error("Failed to fetch user info:", err));
    }
  }, [user]);

  // Fetch transactions on mount.
  useEffect(() => {
    if (user?.token) {
      getTransactions(user.token)
        .then((data: GetTransactionsResponse) => setTransactions(data.trans_token))
        .catch(err => console.error("Failed to fetch transactions:", err));
    }
  }, [user]);

  // Fetch recipient suggestions when the query changes.
  useEffect(() => {
    if (recipientQuery.length > 0 && user?.token) {
      getUsersList(recipientQuery, user.token)
        .then((data: GetUsersResponse) => setRecipientOptions(data))
        .catch(err => console.error("Failed to fetch users:", err));
    } else {
      setRecipientOptions([]);
    }
  }, [recipientQuery, user]);

  const handleTransactionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTransactionError('');
    if (!user?.token) return;
    const txAmount = parseFloat(amount);
    if (isNaN(txAmount) || txAmount <= 0) {
      setTransactionError("Please enter a valid amount.");
      return;
    }
    if (!selectedRecipient) {
      setTransactionError("Please select a recipient.");
      return;
    }
    const transactionData: CreateTransactionRequest = {
      name: selectedRecipient.name,
      amount: txAmount,
    };
    try {
      const res: CreateTransactionResponse = await createTransaction(transactionData, user.token);
      // Append the new transaction to the list.
      setTransactions(prev => [res.trans_token, ...prev]);
      // Reset the form fields.
      setSelectedRecipient(null);
      setRecipientQuery('');
      setAmount('');
    } catch (err) {
      setTransactionError("Transaction failed.");
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5">
          Welcome, {userInfo ? userInfo.name : "Loading..."}
        </Typography>
        <Typography variant="h6">
          Current PW Balance: {userInfo ? userInfo.balance : "Loading..."}
        </Typography>
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
                    primary={`${tx.date} - ${tx.username}`}
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
