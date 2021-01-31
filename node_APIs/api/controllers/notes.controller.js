const { Notes, validate, validationForId } = require("../models/notes");
const config = require("./../../config");

function NotesController() {
  
  //Get all notes API 
  this.getNotes = async (req, res) => {
    let notes = await Notes.find();
    if (notes) {
      return res.status(config.HTTP_SUCCESS).send({
        status: config.SUCCESS,
        code: config.HTTP_SUCCESS,
        message: notes.length + " notes found.",
        result: notes,
      });
    } else {
      return res.status(config.HTTP_NOT_FOUND).send({
        status: config.ERROR,
        code: config.HTTP_NOT_FOUND,
        error: "There are no notes in the system!",
      });
    }
  };

  //Get individual note by id
  this.getNoteById = async (req, res) => {
    const { error } = validationForId(req.body);
    if (error) {
      return res.status(config.HTTP_FORBIDDEN).send({
        status: config.ERROR,
        code: config.HTTP_FORBIDDEN,
        error: error.details[0].message,
      });
    }
    let note = await Notes.findOne({ _id: req.body.id });
    if (note) {
      return res.status(config.HTTP_SUCCESS).send({
        status: config.SUCCESS,
        code: config.HTTP_SUCCESS,
        message: "Note with given id exists in database.",
        result: note,
      });
    } else {
      return res.status(config.HTTP_NOT_FOUND).send({
        status: config.ERROR,
        code: config.HTTP_NOT_FOUND,
        error: "Issue while fetching the note.",
      });
    }
  };

  //Create note API. Validation for duplicate note name
  this.createNote = async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
      return res.status(config.HTTP_FORBIDDEN).send({
        status: config.ERROR,
        code: config.HTTP_FORBIDDEN,
        error: error.details[0].message,
      });
    }
    let note = await Notes.findOne({ name: req.body.name });
    if (note) {
      return res.status(config.HTTP_BAD_REQUEST).send({
        status: config.ERROR,
        code: config.HTTP_BAD_REQUEST,
        error:
          "Note already exisits! Please use other name to create new note.",
      });
    } else {
      note = new Notes({
        name: req.body.name,
        description: req.body.description,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      note.save();
      return res.status(config.HTTP_SUCCESS).send({
        status: config.SUCCESS,
        code: config.HTTP_SUCCESS,
        message: "Note added successfully.",
        result: note,
      });
    }
  };

  //Update note API by id
  this.updateNote = async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
      return res.status(config.HTTP_FORBIDDEN).send({
        status: config.ERROR,
        code: config.HTTP_FORBIDDEN,
        error: error.details[0].message,
      });
    }
    let noteToUpdate = await Notes.findOne({ _id: req.body.id });
    if (noteToUpdate) {
      let noteDetails = {
        name: req.body.name,
        description: req.body.description,
        updatedAt: new Date(),
      };
      Notes.findOneAndUpdate(
        { _id: noteToUpdate._id },
        noteDetails,
        { upsert: true },
        function (err) {
          if (err) {
            return res.status(config.HTTP_BAD_REQUEST).send({
              status: config.ERROR,
              code: config.HTTP_BAD_REQUEST,
              error: "Note does not exisit! Please create new note.",
            });
          } else {
            return res.status(config.HTTP_SUCCESS).send({
              status: config.SUCCESS,
              code: config.HTTP_SUCCESS,
              message: "Note is updated successfully!",
            });
          }
        }
      );
    } else {
      return res.status(config.HTTP_NOT_FOUND).send({
        status: config.ERROR,
        code: config.HTTP_NOT_FOUND,
        error: "Note does not exisits! Please create new note.",
      });
    }
  };

  //Delete note API by id
  this.deleteNote = async (req, res) => {
    const { error } = validationForId(req.body);
    if (error) {
      return res.status(config.HTTP_FORBIDDEN).send({
        status: config.ERROR,
        code: config.HTTP_FORBIDDEN,
        error: error.details[0].message,
      });
    }
    let noteToDelete = await Notes.findOne({ _id: req.body.id });
    if (noteToDelete) {
      Notes.findOneAndDelete({ _id: req.body.id }, function (err, docs) {
        if (err) {
          return res.status(config.HTTP_NOT_FOUND).send({
            status: config.ERROR,
            code: config.HTTP_NOT_FOUND,
            error: "Note does not exisit!",
          });
        } else {
          return res.status(config.HTTP_SUCCESS).send({
            status: config.SUCCESS,
            code: config.HTTP_SUCCESS,
            message: "Note is deleted successfully!",
          });
        }
      });
    } else {
      return res.status(config.HTTP_NOT_FOUND).send({
        status: config.ERROR,
        code: config.HTTP_NOT_FOUND,
        error: "Note does not exisit!",
      });
    }
  };
}

module.exports = new NotesController();
