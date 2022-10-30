"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var https_1 = __importDefault(require("https"));
var db = require("./index");
var express_openid_connect_1 = require("express-openid-connect");
var dotenv_1 = __importDefault(require("dotenv"));
var body_parser_1 = __importDefault(require("body-parser"));
dotenv_1["default"].config();
//#region import { auth } from 'express-oauth2-jwt-bearer';
var app = (0, express_1["default"])();
app.set("views", path_1["default"].join(__dirname, "views"));
app.set('view engine', 'pug');
var urlencodedParser = body_parser_1["default"].urlencoded({ extended: false });
var externalUrl = process.env.RENDER_EXTERNAL_URL;
var port = externalUrl && process.env.PORT ? parseInt(process.env.PORT) : 4080;
var config = {
    authRequired: false,
    idpLogout: true,
    secret: process.env.SECRET,
    baseURL: externalUrl || "https://localhost:".concat(port),
    clientID: process.env.CLIENT_ID,
    issuerBaseURL: 'https://dev-d52kuhytii7tndmi.us.auth0.com',
    clientSecret: process.env.CLIENT_SECRET,
    authorizationParams: {
        response_type: 'code'
    }
};
// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use((0, express_openid_connect_1.auth)(config));
var isAdmin = function (sub) {
    if (sub == process.env.ADMIN_SUB)
        return true;
    return false;
};
app.get('/', function (req, res) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function () {
        var timovi, utakmice, username, admin, user;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, db.getTeams()];
                case 1:
                    timovi = _e.sent();
                    return [4 /*yield*/, db.getGames()];
                case 2:
                    utakmice = _e.sent();
                    if (req.oidc.isAuthenticated()) {
                        username = (_b = (_a = req.oidc.user) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : (_c = req.oidc.user) === null || _c === void 0 ? void 0 : _c.sub;
                        user = JSON.stringify(req.oidc.user);
                        if (isAdmin((_d = req.oidc.user) === null || _d === void 0 ? void 0 : _d.sub))
                            admin = user;
                    }
                    res.render('index', { username: username, admin: admin, timovi: timovi, utakmice: utakmice });
                    return [2 /*return*/];
            }
        });
    });
});
app.post('/urediti', urlencodedParser, (0, express_openid_connect_1.requiresAuth)(), function (req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var n1, n2, stari_rez, v1, v2, rez;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!isAdmin((_a = req.oidc.user) === null || _a === void 0 ? void 0 : _a.sub)) {
                        res.status(404).send("Pristup nije dozvoljen!");
                    }
                    n1 = Object.keys(req.body)[0];
                    n2 = Object.keys(req.body)[1];
                    return [4 /*yield*/, db.getRez(n1, n2)];
                case 1:
                    stari_rez = _b.sent();
                    v1 = req.body[n1];
                    v2 = req.body[n2];
                    rez = v1 - v2;
                    if (stari_rez == rez)
                        res.redirect("../");
                    return [4 /*yield*/, db.updateTimovi(n1, n2, rez, stari_rez)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, db.updateUtakmica(n1, n2, v1, v2)];
                case 3:
                    _b.sent();
                    res.redirect("../");
                    return [2 /*return*/];
            }
        });
    });
});
app.get("/sign-up", function (req, res) {
    res.oidc.login({
        returnTo: '/',
        authorizationParams: {
            screen_hint: "signup"
        }
    });
});
app.get("/log-in", function (req, res) {
    res.oidc.login({
        returnTo: '/',
        authorizationParams: {
            screen_hint: "login"
        }
    });
});
if (externalUrl) {
    var hostname_1 = '127.0.0.1';
    app.listen(port, hostname_1, function () {
        console.log("Server locally running at http://".concat(hostname_1, ":").concat(port, "/ and from\n  outside on ").concat(externalUrl));
    });
}
else {
    https_1["default"].createServer({
        key: fs_1["default"].readFileSync('server.key'),
        cert: fs_1["default"].readFileSync('server.cert')
    }, app)
        .listen(port, function () {
        console.log("Server running at https://localhost:".concat(port, "/"));
    });
}
