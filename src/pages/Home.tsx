import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useGetUserInfoQuery, useGetTransactionsQuery } from '../services/apiSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import TransactionModal from '../components/TransactionModal';

const Home: React.FC = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const { data: userInfo } = useGetUserInfoQuery(token || '');
  const { data: transactions } = useGetTransactionsQuery(token || '');
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ p: 3, backgroundColor: 'white', borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
          Welcome, {userInfo ? userInfo.user_info_token.name : 'Loading...'}
        </Typography>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Current Balance: {userInfo ? userInfo.user_info_token.balance : 'Loading...'} PW
        </Typography>
        <Button variant="contained" color="primary" onClick={() => setModalOpen(true)}>
          New Transaction
        </Button>
      </Box>

      <Box sx={{ backgroundColor: 'white', p: 3, mt: 4, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
          Transaction History
        </Typography>
        {transactions?.trans_token.length === 0 ? (
          <Typography>No transactions found.</Typography>
        ) : (
          <List>
            {transactions?.trans_token.map((tx) => (
              <React.Fragment key={tx.id}>
                <ListItem>
                  <ListItemText
                    primary={`${tx.date} - ${tx.username}`}
                    secondary={
                      <Typography color={tx.amount < 0 ? 'error' : 'primary'}>
                        {tx.amount < 0 ? 'Debit' : 'Credit'}: {tx.amount} PW
                      </Typography>
                    }
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>

      {/* Transaction Modal */}
      <TransactionModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </Container>
  );
};

export default Home;
