import {ORDERS, USERS}  from './db.js';
//this function fot authorization a user 
export const authorizationMiddleware = (req, res, next) => {
    // we it also can do in body but it is less safely
    const {headers} = req;
    //header contains 'authorization' for authorization
    const id = headers.authorization;
    const user = USERS.find(el.id === id)

    if(!user) {
        return res.status(400).send({message: 'user with such id was not found'});
    }
    req.data = {user};
    return next();
};
