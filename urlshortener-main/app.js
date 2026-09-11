import cookieParser from "cookie-parser";
import express from "express";
import flash from "connect-flash";
import requestIp from "request-ip";
import session from "express-session";

import { authRoutes } from "./routes/auth.routes.js";
import { verifyAuthentication } from "./middlewares/verify-auth-middleware.js";
import { shortenerRoutes } from "./routes/shortener.routes.js";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use(cookieParser());

app.use(
  session({
    secret: "my-secret",
    resave: true,
    saveUninitialized: false,
  })
);

app.use(flash());

app.use(requestIp.mw());

// This must be after cookieParser middleware.
app.use(verifyAuthentication);

app.use((req, res, next) => {
  res.locals.user = req.user;
  return next();
});

// Express routes
app.use(authRoutes);
app.use(shortenerRoutes);

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});