"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const morgan_1 = __importDefault(require("morgan"));
const authentication_controller_1 = __importDefault(require("./controller/authentication.controller"));
const group_controller_1 = __importDefault(require("./controller/group.controller"));
const user_controller_1 = __importDefault(require("./controller/user.controller"));
const conect_redis_1 = require("./config/conect.redis");
const errorHandler_1 = __importDefault(require("./handler/errorHandler"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.use((0, express_session_1.default)({
    store: conect_redis_1.redisStore,
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    cookie: { path: "/", httpOnly: true, secure: false, maxAge: 6000000 },
}));
function runEndpoint(controllers) {
    controllers.forEach((contoller) => {
        app.use("/", contoller.router);
    });
}
// app.use('*', (req: Request, res: Response, next: NextFunction) => {
//   res.status(404).send('This Route is not Found, Please check the url and try again')
// })
runEndpoint([
    new authentication_controller_1.default(),
    new group_controller_1.default(),
    new user_controller_1.default(),
]);
app.use(errorHandler_1.default);
exports.default = app;
