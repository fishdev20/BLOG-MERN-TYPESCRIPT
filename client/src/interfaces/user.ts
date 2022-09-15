export default interface IUser {
    _id: string;
    uid: string;
    name: string;
    email: any;
    picture: any;
}


export const DEFAULT_USER: IUser = {
    _id: '',
    uid: '',
    name: '',
    email: '',
    picture: ''
}

export const DEFAULT_FIRBASE_TOKEN = ''