const express = require("express");
const router = express.Router();
const { ensureAuthenticated, isAdmin } = require("../middleware/checkAuth");
const { session } = require("passport");

router.get("/", (req, res) => {
  res.send("welcome");
});

router.get("/revokeSession/:sessionID", ensureAuthenticated, (req, res) => {
  const sessionID = req.params.sessionID;
  req.sessionStore.destroy(sessionID, (err) => {
    if (err) {
      console.error(err);
    } else {
      res.redirect("/dashboard");
    }
  })
})

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  const isAdmin = req.user.role === "admin";
  const store = req.sessionStore;
  if (isAdmin) {
    store.all((err, sessions) => {
      sessions = JSON.parse(JSON.stringify(sessions));
      res.render("dashboard", {
        user: req.user,
        sessions: sessions,
      })
    });
  } else {
    res.render("dashboard", {
      user: req.user,
      sessions: ""
    });
  }
});

module.exports = router;
