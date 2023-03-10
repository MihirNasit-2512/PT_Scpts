const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
function dbConfig() {
  this.connect = () => {
    mongoose.connect(process.env.DB_PATH, (err, db) => {
      if (err) throw err;
      console.log("DB Connected Sucessfully.");
    });
  };
}

module.exports = new dbConfig();
