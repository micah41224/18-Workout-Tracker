const morgan = require ("morgan");
const express = require("express");
const mongoose = require("mongoose");
// Need to require routes here?

const PORT = process.env.PORT || 3000;

const app = express();

app.use(morgan('dev', {
  skip: function (req, res) { return res.statusCode < 400 }
}))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workoutdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

// routes
app.use(require("./routes/api.js"));
app.use(require("./routes/html.js"))

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});


