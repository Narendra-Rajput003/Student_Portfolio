import { createSlice } from "@reduxjs/toolkit"
import axios from "axios"

const userSlice = createSlice({
    name: "user",
    initialState: {
        loading: false,
        user: {},
        isAuthenticated: false,
        error: null,
        message: null,
        isUpdated: false
    },
    reducers: {
        loginRequest: (state, action) => {
            state.loading = true;
            state.isAuthenticated = false;
            state.user = {},
                state.error = null;
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload;
            state.error = null;
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.user = {},
                state.error = action.payload;
        },
        logoutSuccess: (state, action) => {
            state.loading = false;
            state.isAuthenticated = false,
                state.user = {},
                state.error = null,
                state.message = action.payload;
        },
        logoutFailure: (state, action) => {
            state.loading = false;
            state.isAuthenticated = state.isAuthenticated
            state.user = state.user,
                state.error = action.payload,
                state.message = null;
        },
        getUserRequest: (state, action) => {
            state.loading = true;
            state.isAuthenticated = false;
            state.user = {},
                state.error = null;
        },
        getUserSuccess: (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload;
            state.error = null;
        },
        getUserFailure: (state, action) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.user = {},
                state.error = action.payload;
        },
        updatePasswordRequest: (state, action) => {
            state.loading = true;
            state.isUpdated = false,
                state.error = null;
            state.message = null
        },
        updatePasswordSuccess: (state, action) => {
            state.loading = false;
            state.isUpdated = true;
            state.error = null;
            state.message = action.payload;
        },
        updatePasswordFailure: (state, action) => {
            state.loading = false;
            state.isUpdated = false;
            state.error = action.payload;
            state.message = null;
        },
        updateProfileRequest: (state, action) => {
            state.loading = true;
            state.error = null,
                state.message = null;
            state.isUpdated = false;
        },
        updateProfileSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.message = action.payload;
            state.isUpdated = true;
        },
        updateProfileFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.message = null;
            state.isUpdated = false;
        },
        updateProfileResetAfterUpdate: (state, action) => {
            state.isUpdated = false;
            state.error = null;
            state.message = null;
        },
        clearAllErrors: (state, action) => {
            state.error = null;
            state.user = state.user;
        }



    }
})


export const login = (email, password) => async (dispatch) => {
    // dispatch(loginRequest());
    dispatch(userSlice.actions.loginRequest())
    try {

        const { data } = await axios.post("http://localhost:3000/api/v1/user/login", { email, password }, {
            withCredentials: true, headers: {
                "Content-Type": "application/json"
            }
        });
        dispatch(userSlice.actions.loginSuccess(data.user));
        dispatch(userSlice.actions.clearAllErrors());

    } catch (error) {
        dispatch(userSlice.actions.loginFailure(error.response.data.message));
    }
}

export const getUser = () => async (dispatch) => {
    try {
        dispatch(userSlice.actions.getUserRequest());
        const { data } = await axios.get("http://localhost:3000/api/v1/user/me",
            { withCredentials: true }
        )
        dispatch(userSlice.actions.getUserSuccess(data.user));
        dispatch(userSlice.actions.clearAllErrors());
    } catch (error) {
        dispatch(userSlice.actions.getUserFailure(error.response.data.message));
    }
}

export const logout = () => async (dispatch) => {
    try {
        const { data } = await axios.get("http://localhost:3000/api/v1/user/logout", { withCredentials: true });
        dispatch(userSlice.actions.logoutSuccess(data.message));
        dispatch(userSlice.actions.clearAllErrors());

    } catch (error) {
        dispatch(userSlice.actions.logoutFailure(error.response.data.message));

    }
}

export const updatePassword = (currentPassword, newPassword, confirmNewPassword) => async (dispatch) => {
    dispatch(userSlice.actions.updatePasswordRequest());
    try {

        const { data } = await axios.put("http://localhost:3000/api/v1/user/password/update", { currentPassword, newPassword, confirmNewPassword }, 
            {
                withCredentials: true, headers: { "Content-Type": "application/json" }
            }
        );
        dispatch(userSlice.actions.updatePasswordSuccess(data.message));
        dispatch(userSlice.actions.clearAllErrors());

    } catch (error) {
        dispatch(userSlice.actions.updatePasswordFailure(error.response.data.message));
    }

}

export const updateProfile=(data)=>async(dispatch)=>{
    dispatch(userSlice.actions.updateProfileRequest());
    try {
        const {response}=await axios.put("http://localhost:3000/api/v1/user/me/profile/update",{withCredentials:true,headers:{"Content-Type":"application/json"}});
        dispatch(userSlice.actions.updateProfileSuccess(response.message));
        dispatch(userSlice.actions.clearAllErrors());
    } catch (error) {
        dispatch(userSlice.actions.updateProfileFailure(error.response.response.message));
    }
}

export const clearAllUserErrors = () => (dispatch) => {
    dispatch(userSlice.actions.clearAllErrors());
};

export default userSlice.reducer