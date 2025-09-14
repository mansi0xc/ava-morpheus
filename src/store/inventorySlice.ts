import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type SaveShape = { powerups: string[]; clues: number[] };
export type AddressKey = string; // 'guest' or 0x...

type InventoryState = {
  byAddress: Record<AddressKey, SaveShape>;
};

const initialState: InventoryState = {
  byAddress: { guest: { powerups: [], clues: [] } },
};

const ensure = (state: InventoryState, addr: AddressKey) => {
  if (!state.byAddress[addr]) state.byAddress[addr] = { powerups: [], clues: [] };
};

const slice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    togglePowerup(state, action: PayloadAction<{ address: AddressKey; id: string }>) {
      const { address, id } = action.payload;
      ensure(state, address);
      const list = state.byAddress[address].powerups;
      const i = list.indexOf(id);
      i >= 0 ? list.splice(i, 1) : list.push(id);
    },
    toggleClue(state, action: PayloadAction<{ address: AddressKey; id: number }>) {
      const { address, id } = action.payload;
      ensure(state, address);
      const list = state.byAddress[address].clues;
      const i = list.indexOf(id);
      i >= 0 ? list.splice(i, 1) : list.push(id);
    },
    // when a user connects, migrate guest → wallet if wallet is empty
    migrateGuestToAddress(state, action: PayloadAction<{ address: AddressKey }>) {
      const { address } = action.payload;
      ensure(state, 'guest');
      ensure(state, address);
      const wallet = state.byAddress[address];
      if (wallet.powerups.length === 0 && wallet.clues.length === 0) {
        state.byAddress[address] = { ...state.byAddress['guest'] };
        state.byAddress['guest'] = { powerups: [], clues: [] };
      }
    },
  },
});

export const { togglePowerup, toggleClue, migrateGuestToAddress } = slice.actions;
export default slice.reducer;

// selectors
export const selectInventoryFor = (state: { inventory: InventoryState }, addr: AddressKey) =>
  state.inventory.byAddress[addr] ?? { powerups: [], clues: [] };
