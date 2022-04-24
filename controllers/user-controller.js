import axios from 'axios';
import * as userDao from "../database/daos/UserDao.js";

const userController = (app) => {
    app.get('/api/steamcollector/getAllUsers', (req,res) => {
        getAllUsers(req,res);
    })

    app.get('/api/steamcollector/getUser/:id', (req,res) => {
        getUserById(req,res);
    })

    app.get('/api/steamcollector/getUserSteam/:id', (req,res) => {
        getUserBySteamId(req,res);
    })

    app.post('/api/steamcollector/signup', (req,res) => {
        signup(req,res);
    })

    app.post('/api/steamcollector/login', (req,res) => {
        login(req,res);
    })

    app.post('/api/steamcollector/profile', (req,res) => {
        profile(req,res);
    })

    app.post('/api/steamcollector/logout', (req,res) => {
        logout(req,res);
    })

}

const getUserById = async (req,res) => {
    const userId = req.params.id;
    console.log(userId);
    const response = await(userDao.findUserById(userId));
    console.log(response);
    res.send(response);
}

const getUserBySteamId = async (req,res) => {
    const steamId = req.params.id;
    console.log(steamId);
    const response = await(userDao.findUserBySteamId(parseInt(steamId)));
    console.log(response);
    res.send(response);
}

const getAllUsers = async(req,res) => {
    const response = await(userDao.findAllUsers());
    res.send(response);
}

const signup = async (req, res) => {
    const user = req.body;
    const email = user.PersonalInfo.Email;
    const existingUser = await userDao.findUserByEmail(email)
    if(existingUser) {
        //user already exists
        return res.sendStatus(403)
    } else {
        const newUser = await userDao.createUser(user)
        req.session['user'] = newUser
        res.json(newUser)
    }
}

const login = async (req, res) => {
    let profile = null;
    try{
        const email = req.body.email;
        const password = req.body.password;
        profile = await userDao.findUserByCredentials(email, password);
    } catch (e) {
        console.log("Profile data not found.")
        return;
    }

    try{
        if (profile) {
            req.session['user'] = profile;
            console.log("Sending Profile data");
            console.log(profile);
            res.json(profile);
            return;
        }
    } catch (e) {
        console.log("Failed to add profile to session");
    }
    res.sendStatus(403);
}

const profile = (req, res) => {
    const user = req.session['user']
    if(user) {
        res.json(user)
    } else {
        res.sendStatus(503)
    }
}

const logout = (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
}

export default userController;