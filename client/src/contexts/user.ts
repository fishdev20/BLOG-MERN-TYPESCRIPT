import React, { createContext } from 'react';
import IUser, { DEFAULT_FIRBASE_TOKEN, DEFAULT_USER } from './../interfaces/user';

export interface IUserState {
    user: IUser;
    firebase_token: string;
}

export interface IUSerActions {
    type: 'login' | 'logout' | 'authenticate'
    payload: {
        user: IUser;
        firebase_token: string;
    };
}

export const initialUserState : IUserState = {
    user: DEFAULT_USER,
    firebase_token: DEFAULT_FIRBASE_TOKEN
}

export const userReducer = (state: IUserState, action: IUSerActions) => {
    let user = action.payload.user
    let firebase_token = action.payload.firebase_token

    switch(action.type) {
        case 'login':
            localStorage.setItem('firebase_token', firebase_token)
            return {user,firebase_token}
        case 'logout':
            localStorage.removeItem('firebase_token')
            return initialUserState
        default:
            return state;
    }
}

export interface IUserContextProps {
    userState: IUserState;
    userDispatch: React.Dispatch<IUSerActions>;
}

const UserContext = createContext<IUserContextProps>({
    userState: initialUserState,
    userDispatch: () => {}
})

export interface IUserContextProps {
    userState: IUserState;
    userDispatch: React.Dispatch<IUSerActions>
}

export const UserContextConsumer = UserContext.Consumer
export const UserContextProvider = UserContext.Provider
export default UserContext