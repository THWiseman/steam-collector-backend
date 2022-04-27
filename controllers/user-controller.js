import axios from 'axios';
import * as userDao from "../database/daos/UserDao.js";
import * as steamService from './steam-controller.js'

const userController = (app) => {
    app.get('/api/steamcollector/getAllUsers', (req,res) => {
        getAllUsers(req,res);
    })

    app.get('/api/steamcollector/getUser/:uniqueId', (req,res) => {
        getUserById(req,res);
    })

    app.get('/api/steamcollector/getUserSteam/:id', (req,res) => {
        getUserBySteamId(req,res);
    })

    app.get('/api/steamcollector/curators', (req,res) => {
        getAllCurators(req,res);
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
    const uniqueId = req.params.uniqueId;
    let user = {};
    try{
        user = await steamService.updateUserGameArray(uniqueId);
        res.send(user);
    } catch (e) {
        console.log(e);
    }
}

const getUserBySteamId = async (req,res) => {
    try {
        const steamId = req.params.id;
        const response = await(userDao.findUserBySteamId(parseInt(steamId)));
        res.send(response);
    } catch (e) {
        console.log("Exception thrown during getUserBySteamId");
    }
}

const getAllUsers = async(req,res) => {
    try{
        const response = await(userDao.findAllUsers());
        res.send(response);
    } catch (e) {
        console.log("Exception thrown during find all users.")
    }
}

const signup = async (req, res) => {
    try {
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
    } catch (e) {
        console.log("Exception thrown during signup.");
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
            res.json(profile);
            return;
        }
    } catch (e) {
        console.log("Failed to add profile to session");
    }
    res.sendStatus(403);
}

const profile = async (req, res) => {
    try{
        let user = req.session['user']
        user = await userDao.findUserById(user._id);
        if(user) {
            console.log("Sending logged in profile data");
            res.send(user)
        } else {
            console.log("Logged in profile data not found.")
            res.sendStatus(503)
        }
    } catch (e) {
        console.log("Exception thrown sending profile data.")
    }
}

const logout = (req, res) => {
    try{
        req.session.destroy();
        res.sendStatus(200);
    } catch (e) {
        console.log("Error destroying session");
    }
}

const getAllCurators = async (req,res) => {
    try {
        const curatorArray = await userDao.getAllCurators();
        res.send(curatorArray);
    } catch (e) {
        console.log("Error fetching curators.")
    }
}

export default userController;