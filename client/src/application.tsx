import React, { useEffect, useReducer, useState } from 'react';
import { BrowserRouter, Route, RouteComponentProps, Switch } from 'react-router-dom';
import AuthRoute from './components/AuthRoute';
import LoadingComponent from './components/LoadingComponent';
import logging from './config/logging';
import routes from './config/routes';
import { initialUserState, UserContextProvider, userReducer } from './contexts/user';
import { Validate } from './modules/auth';
export interface IApplicationProps {
 
}

const Application: React.FunctionComponent<IApplicationProps> = (props) => {
    const [userState, userDispatch] = useReducer(userReducer, initialUserState);
    const [authStage, setAuthStage] = useState<string>('Checking localstorage ...');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setTimeout(() => {
            CheckLocalStorageForCredentials();
        }, 1000);

        // eslint-disable-next-line
    }, []);

    const CheckLocalStorageForCredentials = () => {
        setAuthStage('Checking credentials ...');

        const firebase_token = localStorage.getItem('firebase_token');

        if (firebase_token === null)
        {
            userDispatch({ type: 'logout', payload: initialUserState });
            setAuthStage('No credentials found');
            setTimeout(() => {
                setLoading(false);
            }, 500);
        }
        else
        {
            return Validate(firebase_token, (error, user) => {
                if (error)
                {
                    logging.error(error);
                    userDispatch({ type: 'logout', payload: initialUserState });
                    setLoading(false);
                    
                }
                else if (user)
                {
                    userDispatch({ type: 'login', payload: { user, firebase_token } });
                    setLoading(false);
                }
            })
        }
    }

    const userContextValues = {
        userState,
        userDispatch
    };

    if (loading)
    {
        return <LoadingComponent>{authStage}</LoadingComponent>
    }
    console.log(routes)
    return (
        <BrowserRouter>
        <UserContextProvider value={userContextValues}>
            <Switch>
            {routes.map((route, index) => {
                    if (route.auth)
                    {
                        return (
                            <Route
                                path={route.path}
                                exact={route.exact}
                                key={index}
                                render={(routeProps: RouteComponentProps) => <AuthRoute><route.component {...routeProps} /></AuthRoute> }
                            />
                        );
                    }
                    
                    return (
                        <Route
                            path={route.path}
                            exact={route.exact}
                            key={index}
                            render={(routeProps: RouteComponentProps) => <route.component {...routeProps} />}
                        />
                    );
                })}
            </Switch>
        
        </UserContextProvider>
        </BrowserRouter>
    )
}

export default Application;