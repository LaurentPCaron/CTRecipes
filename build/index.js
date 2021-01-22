"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var app = express_1["default"]();
app.use(body_parser_1["default"].urlencoded({ extended: true }));
app.get('/', function (req, res, next) {
    res.send("One day, I'll be a beautifull website!");
});
app.listen(3000, function () {
    console.log('À l\'écoute boss!');
});
