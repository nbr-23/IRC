"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app")); // Import the configured Express instance from app.ts
const PORT = process.env.PORT || 3000;
const server = http_1.default.createServer(app_1.default); // use app here
server.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
