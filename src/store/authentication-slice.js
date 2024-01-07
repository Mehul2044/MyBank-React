import {createSlice} from "@reduxjs/toolkit";

const authenticationSlice = createSlice({
    name: "authentication",
    initialState: {
        isUserLogin: false,
        isAdminLogin: false,
        adminToken: null,
        userToken: null
    },
    reducers: {
        loginUser(state, action) {
            state.isUserLogin = true;
            state.isAdminLogin = false;
            state.adminToken = null;
            state.userToken = action.payload.userToken;
        },
        logoutUser(state, action) {
            state.isUserLogin = false;
            state.isAdminLogin = false;
            state.adminToken = null;
            state.userToken = null;
        },
        loginAdmin(state, action) {
            state.isUserLogin = false;
            state.isAdminLogin = true;
            state.adminToken = action.payload.adminToken;
            state.userToken = null;
        },
        logoutAdmin(state, action) {
            state.isUserLogin = false;
            state.isAdminLogin = false;
            state.adminToken = null;
            state.userToken = null;
        }
    }
});

export const authActions = authenticationSlice.actions;
export default authenticationSlice;