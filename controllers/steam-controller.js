import axios from 'axios';
import * as userDao from "../database/daos/UserDao.js";
import * as appDao from "../database/daos/AppDao.js";
import * as collectionDao from "../database/daos/AppCollectionDao.js";

//All API calls take the form http://api.steampowered.com/<interface name>/<method name>/v<version>/?key=<api key>&format=<format>.

const STEAM_URL = "http://api.steampowered.com/";

//Interface Names:
const NEWS = "ISteamNews/";
const STATS = "ISteamUserStats/";
const USERS = "ISteamUser/";

//API key and what to append to the end of any query.
const STEAM_API_KEY = "0B6497E8A84BD7F9123C98F72EA1812C";
const KEY_SUFFIX = "?key=" + STEAM_API_KEY + "&format=json&";
const MY_ID = "76561197978497049";

const steamController = (app) => {
   app.get('/api/steam/getUserInfo/:uniqueId', (req, res) => {
      getUserInfo(req,res);
   });
   app.get('/api/steam/getOwnedGames/:steamId', (req,res) => {
      getOwnedGames(req,res);
   });
   app.get('/api/steam/getAllApps/', (req,res) => {
      getAllApps(req,res);
   });
   app.get('/api/steam/getAppsByName/:appSearchString', (req,res) => {
      getAppsByName(req,res);
   });
   app.get('/api/steam/getAppInfo/:appId', (req,res) => {
      getAppInfo(req,res);
   })
   app.post('/api/steam/recommendApp'), (req,res) => {
      recommendApp(req,res);
   }
};

export const updateUserGameArray = async (id) => {
   console.log(id);
   let responseFromDb = await(userDao.findUserById(id));
   if(!responseFromDb) {
      console.log("User not found in database");
      return {};
   }
   try {
      const responseFromSteam = await(axios.get(STEAM_URL + "IPlayerService/GetOwnedGames/v1/" + KEY_SUFFIX + "steamid=" + responseFromDb.SteamId + "&include_appinfo=true"));
      const gameObjectList = responseFromSteam.data.response.games;
      let gamesArray = gameObjectList.map(g => g.appid);
      responseFromDb.OwnedApps = gamesArray;
      responseFromDb = await userDao.updateUser(uniqueId, responseFromDb);
      return responseFromDb;
   } catch (e) {
      console.log("Error getting data using SteamId, probably an invalid SteamID was provided.");
      return responseFromDb;
   }
}
//This gets detailed profile data from steam:
//const responseFromSteam = await(axios.get(STEAM_URL + USERS + "GetPlayerSummaries/v002/" + KEY_SUFFIX + "steamids=" + responseFromDb.SteamId));
//console.log(responseFromSteam.data.response.players[0]);
export const getUserInfo = async (req,res) => {
   //the unique ID of the user in our database.
   const uniqueId = req.params.uniqueId;
   let responseFromDb = await(userDao.findUserById(uniqueId));
   if(!responseFromDb){ //if the user is not in our database, return.
      res.sendStatus(404);
      return;
   }

   if(responseFromDb.SteamId){
      responseFromDb = updateUserGameArray(uniqueId);
   }
   res.send(responseFromDb);
}

const getOwnedGames = async(req,res) => {
   const steamId = req.params.steamId;
   const response = await(axios.get(STEAM_URL + "IPlayerService/GetOwnedGames/v1/" + KEY_SUFFIX + "steamid=" + steamId + "&include_appinfo=true"));
   res.send(response.data.response.games)
}

const getAllApps = async(req,res) => {
   const URL = STEAM_URL + "ISteamApps/GetAppList/v2/"
   const response = await(axios.get(URL));
   const allApps = response.data.applist.apps;
   res.send(allApps);
}

const getAppsByName = async(req,res) => {
   const name = req.params.appSearchString;
   const response = await(axios.get(STEAM_URL + "/ISteamApps/GetAppList/v2/"));
   const allApps = response.data.applist.apps;
   const filteredApps = allApps.filter(obj => {
      return obj.name.toLowerCase().includes(name.toLowerCase());
   })
   res.send(filteredApps);
}

const getAppInfo = async(req,res) => {

   //Parse App ID from URL
   const appId = req.params.appId;

   //Check if in database already.
   const responseFromDb = await(appDao.findAppByAppId(appId));

   //If it is, send it to the caller and return.
   if(responseFromDb){
      try {
         res.send(responseFromDb);
         return;
      } catch (e) {
         console.log("Error getting game data from database.");
      }
   }

   //If It's not, create a default object, populate it with some data from steam, store a copy in our db, and send a copy to the caller.
   let response = {
      "AppId" : appId,
      "AppCollections" : [],
      "OwnedBy" : [],
      "RecommendedBy" : [],
      "AnonymousRecommendations" : 0,
      "AppTitle" : "",
      "Price" : "",
   }
   const responseFromSteam = await(axios.get("https://store.steampowered.com/api/appdetails?appids=" + appId));
   if(responseFromSteam){
      try{
         response.AppTitle = responseFromSteam.data[appId]["data"]["name"];
         response.Price = responseFromSteam.data[appId]["data"]["price_overview"]["final_formatted"];
      } catch (e) {
         console.log("Error getting game data from steam");
      }
   }

   response = await appDao.createApp(response);
   res.send(response);
}

const recommendApp = async(req,res) => {
   let userId = "";
   let appId = "";
   try{
      userId = req.body.userId;
      appId = req.body.appId;
   } catch (e) {
      console.log("error getting app info from post body.")
   }

   let app = {};
   let user = {};
   try{
      app = await appDao.recommendApp(userId, appId);
   } catch(e) {
      console.log("Error recommending app.");
   }

   try {
      user = await userDao.recommendApp(userId, appId);
   } catch(e) {
      console.log("Error updating user with recommended app.");
   }
   res.send(app);
}

export default steamController;