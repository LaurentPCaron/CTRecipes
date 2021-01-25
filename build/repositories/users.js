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
var fs_1 = require("fs");
var util_1 = require("util");
var crypto_1 = __importDefault(require("crypto"));
var scrypt = util_1.promisify(crypto_1["default"].scrypt);
var UsersRepository = /** @class */ (function () {
    function UsersRepository(filename) {
        this.fileName = filename;
        try {
            fs_1.accessSync(this.fileName);
        }
        catch (error) {
            fs_1.writeFileSync(this.fileName, '[]');
        }
    }
    UsersRepository.prototype.create = function (_a) {
        var email = _a.email, password = _a.password;
        return __awaiter(this, void 0, void 0, function () {
            var id, saltyPassword, user, users;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        id = crypto_1["default"].randomBytes(4).toString('hex');
                        return [4 /*yield*/, this.generatePassword(password)];
                    case 1:
                        saltyPassword = _b.sent();
                        user = { id: id, email: email, password: saltyPassword };
                        return [4 /*yield*/, this.getAll()];
                    case 2:
                        users = _b.sent();
                        users.push(user);
                        return [4 /*yield*/, this.writeAll(users)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, user];
                }
            });
        });
    };
    UsersRepository.prototype.generatePassword = function (password, _salt) {
        return __awaiter(this, void 0, void 0, function () {
            var salt, saltPassword;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        salt = _salt ? _salt : crypto_1["default"].randomBytes(16).toString('hex');
                        return [4 /*yield*/, scrypt(password, salt, 64)];
                    case 1:
                        saltPassword = _a.sent();
                        return [2 /*return*/, saltPassword.toString('hex') + "@" + salt];
                }
            });
        });
    };
    UsersRepository.prototype.passwordsMatch = function (saved, sumitted) {
        return __awaiter(this, void 0, void 0, function () {
            var salt, sumittedHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        salt = saved.split('@')[1];
                        return [4 /*yield*/, this.generatePassword(sumitted, salt)];
                    case 1:
                        sumittedHash = _a.sent();
                        return [2 /*return*/, saved === sumittedHash];
                }
            });
        });
    };
    UsersRepository.prototype.getAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = JSON).parse;
                        return [4 /*yield*/, fs_1.promises.readFile(this.fileName, { encoding: 'utf-8' })];
                    case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                }
            });
        });
    };
    UsersRepository.prototype.writeAll = function (users) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fs_1.promises.writeFile(this.fileName, JSON.stringify(users, null, 2))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UsersRepository.prototype.getOneBy = function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            var users, _i, users_1, user, isMatching, key;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getAll()];
                    case 1:
                        users = _a.sent();
                        for (_i = 0, users_1 = users; _i < users_1.length; _i++) {
                            user = users_1[_i];
                            isMatching = true;
                            for (key in filters) {
                                if (filters[key] !== user[key]) {
                                    isMatching = false;
                                }
                            }
                            if (isMatching) {
                                return [2 /*return*/, user];
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    UsersRepository.prototype.update = function (id, value) {
        return __awaiter(this, void 0, void 0, function () {
            var users, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getAll()];
                    case 1:
                        users = _a.sent();
                        user = users.find(function (u) { return u.id === id; });
                        if (!user) {
                            throw new Error("No user found with the id \"" + id + "\"");
                        }
                        Object.assign(user, value);
                        return [4 /*yield*/, this.writeAll(users)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UsersRepository.prototype["delete"] = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var users, newUsersList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getAll()];
                    case 1:
                        users = _a.sent();
                        newUsersList = users.filter(function (u) { return u.id !== id; });
                        return [4 /*yield*/, this.writeAll(newUsersList)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return UsersRepository;
}());
exports["default"] = new UsersRepository('users.json');
