import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type WalletStatus = 'disconnected' | 'connecting' | 'connected';

interface WalletState {
  address: string | null;
  status: WalletStatus;
}

const initialState: WalletState = {
  address: null,
  status: 'disconnected',
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWalletAddress(state, action: PayloadAction<string | null>) {
      state.address = action.payload;
      state.status = action.payload ? 'connected' : 'disconnected';
    },
    setWalletStatus(state, action: PayloadAction<WalletStatus>) {
      state.status = action.payload;
    },
    resetWallet(state) {
      state.address = null;
      state.status = 'disconnected';
    },
  },
});

export const { setWalletAddress, setWalletStatus, resetWallet } = walletSlice.actions;
export default walletSlice.reducer;

// selectors
export const selectWalletAddress = (s: { wallet: WalletState }) => s.wallet.address;
export const selectWalletStatus  = (s: { wallet: WalletState }) => s.wallet.status;
