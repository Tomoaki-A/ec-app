// Store で管理している state を参照する関数を定義して export する

import { createSelector } from "reselect";

const usersSelector = (state) => state.users;

export const getIsSignedIn = createSelector(
  [usersSelector],
  state => state.isSignedIn
)

export const getUserId = createSelector(
  [usersSelector], 
  (state) => state.uid
  );
export const getUsername = createSelector(
  [usersSelector], 
  (state) => state.username
  );

  