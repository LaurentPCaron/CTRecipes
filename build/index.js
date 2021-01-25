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
var body_parser_1 = __importDefault(require("body-parser"));
var cookie_session_1 = __importDefault(require("cookie-session"));
var users_1 = __importDefault(require("./repositories/users"));
var app = express_1["default"]();
app.use(body_parser_1["default"].urlencoded({ extended: true }));
app.use(cookie_session_1["default"]({
    keys: ['tf2YN1uPWjHzPWhK3npE']
}));
//SIGN-UP
app.get('/sign-up', function (req, res, next) {
    res.send("\n  <div>\n  " + (req.session.userId ? "Your ID is: " + req.session.userId : '') + "\n    <form method=\"POST\">\n        <input name=\"email\" placeholder=\"email\" type=\"email\"/>\n        <input name=\"password\" placeholder=\"password\" type=\"password\"/>\n        <input name=\"passwordConfirmation\" placeholder=\"password confirmation\" type=\"password\"/>\n        <button>Sign-Up</button>\n    </form>\n  </div>\n  ");
});
app.post('/sign-up', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, passwordConfirmation, isUserUsed, user;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password, passwordConfirmation = _a.passwordConfirmation;
                return [4 /*yield*/, users_1["default"].getOneBy({ email: email })];
            case 1:
                isUserUsed = _b.sent();
                if (isUserUsed) {
                    return [2 /*return*/, res.send('Email inm use')];
                }
                if (password !== passwordConfirmation) {
                    return [2 /*return*/, res.send('Password must match')];
                }
                return [4 /*yield*/, users_1["default"].create({ email: email, password: password })];
            case 2:
                user = _b.sent();
                if (req.session)
                    req.session.userId = user.id;
                res.send("Acount " + email + " created");
                return [2 /*return*/];
        }
    });
}); });
//LOGIN
app.get('/login', function (req, res, next) {
    res.send("\n    <div>\n      <form method=\"POST\">\n          <input name=\"email\" placeholder=\"email\" type=\"email\"/>\n          <input name=\"password\" placeholder=\"password\" type=\"password\"/>\n          <button>Login</button>\n      </form>\n    </div>\n    ");
});
app.post('/login', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password;
                return [4 /*yield*/, users_1["default"].getOneBy({ email: email })];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.send('No acount with this email found')];
                }
                return [4 /*yield*/, users_1["default"].passwordsMatch(user.password, password)];
            case 2:
                if (!(_b.sent())) {
                    return [2 /*return*/, res.send('Invalide password')];
                }
                if (req.session)
                    req.session.userId = user.id;
                res.send("You're login!");
                return [2 /*return*/];
        }
    });
}); });
//LOGOUT
app.get('/logout', function (req, res, next) {
    req.session = null;
    res.send("You're logged out");
});
app.listen(3000, function () {
    console.log("À l'écoute boss!");
});
