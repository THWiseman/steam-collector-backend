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
   app.get('/api/steam/getUserInfo/:steamId', (req, res) => {
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
};


const getUserInfo = async (req,res) => {
   const steamId = req.params.steamId;
   if(steamId){
      const responseFromSteam = await(axios.get(STEAM_URL + USERS + "GetPlayerSummaries/v002/" + KEY_SUFFIX + "steamids=" + steamId));
      const responseFromDb = await(userDao.findUserBySteamId(parseInt(steamId)));
      const response = {
         "steam" : responseFromSteam.data.response,
         "db" : responseFromDb
      }
      console.log(response);
      res.send(response);
   }
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

export default steamController;