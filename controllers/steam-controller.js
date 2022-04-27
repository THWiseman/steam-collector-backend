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

   app.post('/api/steam/recommendApp/', (req,res) => {
      console.log("recommend");
      recommendApp(req,res);
   })

   app.get('/api/steam/getUserInfo/:uniqueId', (req, res) => {
      getUserInfo(req,res);
   });
   app.get('/api/steam/getOwnedGames/:steamId', (req,res) => {
      getOwnedGames(req,res);
   });
   app.get('/api/steam/getRecentGames/:steamId', (req,res) => {
      getRecentGames(req,res);
   })
   app.get('/api/steam/getAllApps/', (req,res) => {
      getAllApps(req,res);
   });
   app.get('/api/steam/getAppsByName/:appSearchString', (req,res) => {
      getAppsByName(req,res);
   });
   app.get('/api/steam/getAppInfo/:appId', (req,res) => {
      getAppInfo(req,res);
   });
   app.get('/api/steam/getBasicAppInfo/:appId', (req,res) => {
      getBasicAppInfo(req,res);
   });
};

export const updateUserGameArray = async (id) => {
   console.log(id);
   let responseFromDb = await(userDao.findUserById(id.toString()));
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

const getRecentGames = async(req,res) => {
   try {
      const steamId = req.params.steamId;
      const response = await axios.get(STEAM_URL + "IPlayerService/GetRecentlyPlayedGames/v1/" + KEY_SUFFIX + "steamid=" + steamId + "&include_appinfo=true");
      console.log(response);
      const array = []
      response.data.response.games.map(g => array.push(g.appid))
      res.send(array);
   } catch {
      console.log("Failed to get recently played games.");
   }

}

const getAllApps = async(req,res) => {
   const URL = STEAM_URL + "ISteamApps/GetAppList/v2/"
   const response = await(axios.get(URL));
   const allApps = response.data.applist.apps;
   //const apps = await appDao.insertAllApps(allApps);
   res.send(allApps);
}

const getAppsByName = async(req,res) => {
   const name = req.params.appSearchString;
   const response = await(axios.get(STEAM_URL + "ISteamApps/GetAppList/v2/"));
   const allApps = response.data.applist.apps;
   const filteredApps = allApps.filter(obj => {
      return obj.name.toLowerCase().includes(name.toLowerCase());
   })
   res.send(filteredApps);
}

const getBasicAppInfo = async(req,res) => {
   const appId = req.params.appId;
   let response = await(appDao.findAppByAppId(appId));
   res.send(response);
}
const getAppInfo = async(req,res) => {
   //Parse App ID from URL
   const appId = req.params.appId;
   let response = await(appDao.findAppByAppId(appId));

   //If It's not, create a default object, populate it with some data from steam, store a copy in our db, and send a copy to the caller.
   let responseFromSteam = false;
   try{
      responseFromSteam = await(axios.get("https://store.steampowered.com/api/appdetails?appids=" + appId));
   } catch (e) {
      console.log("Steam failed to reply with data.");
   }

   if(responseFromSteam){
      try{
         response.Price = responseFromSteam.data[appId]["data"]["price_overview"]["final_formatted"];
      } catch (e) {
         console.log("Error getting game data from steam");
      }
   }

   try{
      const collectionsThatHaveApp =  await collectionDao.findCollectionsThatContainApp(appId);
      const usersThatOwnApp = await userDao.findUsersThatOwnApp(appId);
      const usersThatRecommendApp = await userDao.findUsersThatRecommendApp(appId);
      response.AppCollections = collectionsThatHaveApp;
      response.OwnedBy = usersThatOwnApp;
      response.RecommendedBy = usersThatRecommendApp;
   } catch (e) {
      console.log("Data enrichment failed.");
   }

   try{
      response = await appDao.updateApp(response);
      res.send(response);
   } catch (e) {
      console.log("Something bad happened.");
   }

}

const recommendApp = async(req,res) => {
   let userId = "";
   let appId = "";
   console.log(req.body);
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
      req.session['user'] = user;
   } catch(e) {
      console.log("Error updating user with recommended app.");
   }
   res.send(app);
}

export default steamController;