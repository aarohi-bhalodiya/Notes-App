const users = require("./api/controllers/user.controller");
const notes = require("./api/controllers/notes.controller");
const authenticate = require("./api/controllers/authenticate.controller");

module.exports = {
    configure: function(app, router) {
        //Login API
        app.post("/api/login", (req, res) => {
            users.login(req, res);
        });
        //Register user API
        app.post("/api/createUser", (req, res) => {
            users.createUser(req, res);
        });
        //Get all notes API
        app.post("/api/getNotes", authenticate.isAuthenticated, (req, res) => {
            notes.getNotes(req, res);
        });
        //Get Note by Id API
        app.post("/api/getNotesById", authenticate.isAuthenticated, (req, res) => {
            notes.getNoteById(req, res);
        });
        //Create note API
        app.post("/api/createNote", authenticate.isAuthenticated, (req, res) => {
            notes.createNote(req, res);
        });
        //Update Note by Id API
        app.put("/api/updateNote", authenticate.isAuthenticated, (req, res) => {
            notes.updateNote(req, res);
        });
        //Delete Note by Id API
        app.post("/api/deleteNote", authenticate.isAuthenticated, (req, res) => {
            notes.deleteNote(req, res);
        });
    }
}