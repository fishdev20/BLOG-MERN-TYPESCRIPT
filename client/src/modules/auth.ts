import axios from 'axios';
import firebase from 'firebase/compat/app';
import config from '../config/config';
import { auth } from '../config/firebase';
import logging from '../config/logging';
import IUser from './../interfaces/user';

export const SignInWithSocialMedia = (provider: firebase.auth.AuthProvider) => 
    new Promise<firebase.auth.UserCredential>((resolve,reject) => {
        auth.signInWithPopup(provider)
            .then(result => resolve(result))
            .then(err => reject(err))
})

const NAMESPACE = 'Auth';

export const Authenticate = async (uid: string, name: string, email: any, picture: any, firebase_token: string, callback: (error: string | null, user: IUser | null) => void) => {
    try {
        let response = await axios({
            method: 'POST',
            url: `${config.server.url}/users/login`,
            data: {
                uid,
                name,
                email,
                picture
            },
            headers: { Authorization: `Bearer ${firebase_token}` }
        });

        if (response.status === 200 || response.status === 201 || response.status === 304) {
            logging.info('Successfully authenticated.', NAMESPACE);
            callback(null, response.data.user);
        } else {
            logging.warn('Unable to authenticate.', NAMESPACE);
            callback('Unable to authenticate.', null);
        }
    } catch (error) {
        logging.error(error, NAMESPACE);
        callback('Unable to authenticate.', null);
    }
};

export const Validate = async (firebase_token: string, callback: (error: string | null, user: IUser | null) => void) => {
    try {
        let response = await axios({
            method: 'GET',
            url: `${config.server.url}/users/validate`,
            headers: { Authorization: `Bearer ${firebase_token}` }
        });

        if (response.status === 200 || response.status === 304) {
            logging.info('Successfully validated.', NAMESPACE);
            callback(null, response.data.user);
        } else {
            logging.warn(response, NAMESPACE);
            callback('Unable to validate.', null);
        }
    } catch (error) {
        logging.error(error, NAMESPACE);
        callback('Unable to validate.', null);
    }
};
