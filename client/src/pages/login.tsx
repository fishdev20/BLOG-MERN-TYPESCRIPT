import firebase from 'firebase/compat/app';
import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader } from 'reactstrap';
import CenterPiece from '../components/CenterPiece';
import ErrorText from '../components/ErrorText';
import LoadingComponent from '../components/LoadingComponent';
import { Providers } from '../config/firebase';
import logging from '../config/logging';
import UserContext from '../contexts/user';
import IPageProps from '../interfaces/page';
import { Authenticate, SignInWithSocialMedia as SocialMediaPopup } from './../modules/auth';

const LoginPage: React.FunctionComponent<IPageProps> = props => {
    const [authenticating, setAuthenticating] = useState<boolean>(false)
    const [error, setError] = useState<string>('')

    const userContext = useContext(UserContext)
    
    const history = useHistory()
    const isLogin = window.location.pathname.includes('login')
    const SignInWithSocialMedia = (provider: firebase.auth.AuthProvider) => {
        if(error !== "") setError('')

        setAuthenticating(true)
        SocialMediaPopup(provider)
            .then( async (result) => {
                logging.info(result);
                let user = result.user

                if(user) {
                    let uid = user.uid;
                    let name = user.displayName;
                    let email = user.email
                    let picture = user.photoURL

                    if(name) {
                        try {
                            let firebase_token = await user.getIdToken()
                            Authenticate(uid, name, email, picture, firebase_token, (error, _user) => {
                                if (error){
                                    setError(error);
                                    setAuthenticating(false);
                                }else if (_user){
                                    userContext.userDispatch({ type: 'login', payload: { user: _user, firebase_token } })
                                    history.push('/');
                                }
                            })
                        }catch {
                            setError('Invalid token')
                            logging.error(error)
                            setAuthenticating(false)
                        }
                    } else {
                        setError('The identity provider doesnt have a name')
                        setAuthenticating(false)
                    }
                } else {
                    setError('The identity provider is missing a lot of necessary info')
                    setAuthenticating(false)
                }
            }).catch(err => {
                setError(err.message)
                setAuthenticating(false)
            })
    }
    return (
        <CenterPiece>
            <Card>
                <CardHeader>
                    {isLogin ? 'Login' : 'Sign up'}
                </CardHeader>
                <CardBody>
                    <ErrorText error={error}/>
                    <Button
                        block
                        disabled={authenticating}
                        onClick={() => SignInWithSocialMedia(Providers.google)}
                        style={{ backgroundColor:'#ea4335', borderColor: '#ea4335'}} 
                    >
                        <i className="fab fa-google mr-2"></i> Sign {isLogin ? 'in' : 'up'} with Google
                    </Button>
                    {authenticating && <LoadingComponent card={false} />} 
                </CardBody>
            </Card>
        </CenterPiece>
    )
 }

export default LoginPage;