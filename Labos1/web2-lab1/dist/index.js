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
exports.updateUtakmica = exports.getRez = exports.updateTimovi = exports.getGames = exports.getTeams = void 0;
var pg_1 = require("pg");
var dotenv_1 = __importDefault(require("dotenv"));
var Utakmica_1 = require("./Utakmica");
var Tim_1 = require("./Tim");
dotenv_1["default"].config({ path: require('find-config')('.env') });
var pool = new pg_1.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'web2-lab1',
    password: process.env.DB_PASSWORD,
    port: 5432
});
function getTeams() {
    return __awaiter(this, void 0, void 0, function () {
        var timovi, results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    timovi = [];
                    return [4 /*yield*/, pool.query('SELECT ime,bodovi,razlika from "Timovi" ORDER BY bodovi DESC ,razlika DESC')];
                case 1:
                    results = _a.sent();
                    results.rows.forEach(function (r) {
                        timovi.push(new Tim_1.Tim(r["ime"], r["bodovi"], r["razlika"]));
                    });
                    return [2 /*return*/, timovi];
            }
        });
    });
}
exports.getTeams = getTeams;
function getGames() {
    return __awaiter(this, void 0, void 0, function () {
        var utakmice, results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    utakmice = [];
                    return [4 /*yield*/, pool.query('SELECT tim1_ime,tim2_ime,tim1_poeni,tim2_poeni from "Utakmice" ORDER BY id')];
                case 1:
                    results = _a.sent();
                    results.rows.forEach(function (r) {
                        console.log(new Utakmica_1.Utakmica(r["tim1_ime"], r["tim2_ime"], r["tim1_poeni"], r["tim2_poeni"]).tim1_ime);
                        utakmice.push(new Utakmica_1.Utakmica(r["tim1_ime"], r["tim2_ime"], r["tim1_poeni"], r["tim2_poeni"]));
                    });
                    return [2 /*return*/, utakmice];
            }
        });
    });
}
exports.getGames = getGames;
function updateTimovi(n1, n2, rez, stari_rez) {
    return __awaiter(this, void 0, void 0, function () {
        var raz, raz;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(stari_rez == 0)) return [3 /*break*/, 2];
                    return [4 /*yield*/, addNewScore(rez, n1, n2)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 15];
                case 2:
                    if (!((stari_rez > 0 && rez > 0) || (stari_rez < 0 && rez < 0))) return [3 /*break*/, 9];
                    raz = rez - stari_rez;
                    if (!(rez > 0)) return [3 /*break*/, 5];
                    return [4 /*yield*/, pool.query('UPDATE "Timovi" SET razlika=razlika+$1 WHERE ime=$2', [raz, n1])];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, pool.query('UPDATE "Timovi" SET razlika=razlika-$1 WHERE ime=$2', [raz, n2])];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 8];
                case 5: return [4 /*yield*/, pool.query('UPDATE "Timovi" SET razlika=razlika+$1 WHERE ime=$2', [raz, n1])];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, pool.query('UPDATE "Timovi" SET razlika=razlika-$1 WHERE ime=$2', [raz, n2])];
                case 7:
                    _a.sent();
                    _a.label = 8;
                case 8: return [3 /*break*/, 15];
                case 9:
                    raz = rez - stari_rez;
                    if (!(rez > 0)) return [3 /*break*/, 12];
                    return [4 /*yield*/, pool.query('UPDATE "Timovi" SET bodovi=bodovi+$1,razlika=razlika+$2 WHERE ime=$3', [1, raz, n1])];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, pool.query('UPDATE "Timovi" SET bodovi=bodovi-$1,razlika=razlika-$2 WHERE ime=$3', [1, raz, n2])];
                case 11:
                    _a.sent();
                    return [3 /*break*/, 15];
                case 12: return [4 /*yield*/, pool.query('UPDATE "Timovi" SET bodovi=bodovi-$1,razlika=razlika+$2 WHERE ime=$3', [1, raz, n1])];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, pool.query('UPDATE "Timovi" SET bodovi=bodovi+$1,razlika=razlika-$2 WHERE ime=$3', [1, raz, n2])];
                case 14:
                    _a.sent();
                    _a.label = 15;
                case 15: return [2 /*return*/];
            }
        });
    });
}
exports.updateTimovi = updateTimovi;
function addNewScore(rez, n1, n2) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(rez > 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, pool.query('UPDATE "Timovi" SET bodovi=bodovi+$1,razlika=razlika+$2 WHERE ime=$3', [1, rez, n1])];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, pool.query('UPDATE "Timovi" SET razlika=razlika-$1 WHERE ime=$2', [rez, n2])];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 3: return [4 /*yield*/, pool.query('UPDATE "Timovi" SET razlika=razlika+$1 WHERE ime=$2', [rez, n1])];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, pool.query('UPDATE "Timovi" SET bodovi=bodovi+$1,razlika=razlika-$2 WHERE ime=$3', [1, rez, n2])];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    });
}
function getRez(n1, n2) {
    return __awaiter(this, void 0, void 0, function () {
        var r, rez;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, pool.query('SELECT tim1_poeni,tim2_poeni FROM "Utakmice" WHERE tim1_ime=$1 and tim2_ime=$2', [n1, n2])];
                case 1:
                    r = _a.sent();
                    rez = r.rows[0]["tim1_poeni"] - r.rows[0]["tim2_poeni"];
                    return [2 /*return*/, rez];
            }
        });
    });
}
exports.getRez = getRez;
function updateUtakmica(n1, n2, v1, v2) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, pool.query('UPDATE "Utakmice" SET tim1_poeni=$1,tim2_poeni=$2 WHERE tim1_ime=$3 AND tim2_ime=$4', [v1, v2, n1, n2])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.updateUtakmica = updateUtakmica;
