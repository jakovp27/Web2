import express from 'express';
import fs from 'fs';
import path from 'path'
import https from 'https';
import db = require('./index');
import {auth, requiresAuth } from 'express-openid-connect';
import dotenv from 'dotenv'
import {Utakmica} from './Utakmica';
import bodyParser from 'body-parser'
import { ObjectFlags } from 'typescript';
dotenv.config()
//#region import { auth } from 'express-oauth2-jwt-bearer';

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'pug');
var urlencodedParser = bodyParser.urlencoded({ extended: false })


const externalUrl = process.env.RENDER_EXTERNAL_URL;
const port = externalUrl && process.env.PORT ? parseInt(process.env.PORT) : 4080;

const config = {
  authRequired: false,
  idpLogout: true, //login not only from the app, but also from identity provider
  secret: process.env.SECRET,
  baseURL: externalUrl || `https://localhost:${port}`,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: 'https://dev-d52kuhytii7tndmi.us.auth0.com',
  clientSecret: process.env.CLIENT_SECRET,
  authorizationParams: {
    response_type: 'code',
    //scope: "openid profile email"   
  },
};




// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

const isAdmin = (sub:any) => {
  if(sub == process.env.ADMIN_SUB)
    return true;
  return false;
}

app.get('/', async function (req, res) {
  let timovi = await db.getTeams();
  let utakmice = await db.getGames();
  let username: string | undefined;
  let admin : string | undefined;
  if (req.oidc.isAuthenticated()) {
    username = req.oidc.user?.name ?? req.oidc.user?.sub;
    const user = JSON.stringify(req.oidc.user);
    if(isAdmin(req.oidc.user?.sub))
      admin = user
  }
  res.render('index', { username,admin,timovi,utakmice});
});

app.post('/urediti',urlencodedParser,requiresAuth(),async function (req, res) {
  if(!isAdmin(req.oidc.user?.sub)){
    res.status(404).send("Pristup nije dozvoljen!");
  }
 
  const n1:string = Object.keys(req.body)[0]
  const n2:string = Object.keys(req.body)[1]
  const stari_rez = await db.getRez(n1,n2)
  const v1:number = req.body[n1]
  const v2:number = req.body[n2]
  var rez = v1 - v2
  if(stari_rez==rez)
    res.redirect("../")
  await db.updateTimovi(n1,n2,rez,stari_rez);
  await db.updateUtakmica(n1,n2,v1,v2);
  res.redirect("../")





});


app.get("/sign-up", (req, res) => {
  res.oidc.login({
    returnTo: '/',
    authorizationParams: {
      screen_hint: "signup",
    },
  });
});
app.get("/log-in", (req, res) => {
  res.oidc.login({
    returnTo: '/',
    authorizationParams: {
      screen_hint: "login",
    },
  });
});



if (externalUrl) {
  const hostname = '127.0.0.1';
  app.listen(port, hostname, () => {
    console.log(`Server locally running at http://${hostname}:${port}/ and from
  outside on ${externalUrl}`);
  });
}
else {
  https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
  }, app)
    .listen(port, function () {
      console.log(`Server running at https://localhost:${port}/`);
    });
}


