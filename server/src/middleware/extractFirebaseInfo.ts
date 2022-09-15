import { NextFunction, Request, Response } from "express";
import firebaseAdmin from 'firebase-admin';
import logging from "../config/logging";

const extractFirebaseInfo = (req: Request, res: Response, next: NextFunction) => {
    logging.info('Validating firebase token ...')

    let token = req.headers.authorization?.split(' ')[1]
    if(token) {
        firebaseAdmin
            .auth()
            .verifyIdToken(token)
            .then(result => {
                if(result) {
                    res.locals.firebase = result
                    res.locals.firebase_token = token
                    next() 
                } else {
                    logging.warn('Token invalid')
                    return res.status(401).json({
                        message: 'invalid'
                    })
                }
                
            }).catch (err => {
                logging.error(err)
                return res.status(401).json({
                    err,
                    message: 'invalid'
                })
            })
    } else {
        return res.status(401).json({
            message: 'invalid'
        })
    }
}

export default extractFirebaseInfo