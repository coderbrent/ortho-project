const fs = require("fs");
const express = require("express");
const app = express();
const port = 8080;
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const path = require("path");
const papaParse = require("papaparse");
const cors = require("cors");
let ejs = require("ejs");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.set("view engine", "ejs");

app.listen(port, () => console.log("listening on " + port));

app.post("/upload_file", upload.single("uploaded_file"), async (req, res) => {
  req.file
    ? res.json({ msg: `${req.file.originalname} was successfully uploaded.` })
    : res.json({
        msg:
          "There was an error uploading your file. Please check the file and try again."
      });
});

app.get("/get_data", (req, res) => {
  fs.readdir(__dirname + "/uploads", (err, files) => {
    if (err) console.error(err);
    if (files) {
      let file = files[0];
      fs.readFile(
        __dirname + "/uploads/" + file,
        { encoding: "utf-8" },
        (err, data) => {
          if (err) console.error(err);
          let fileData = papaParse.parse(data);
          res.json(fileData.data);
        }
      );
    }
  });
});

app.get("/view_upload", (req, res) => {
  res.sendFile(__dirname + "/views/names.html");
});

app.get("/index", (req, res) => {
  res.render("index.ejs");
});
