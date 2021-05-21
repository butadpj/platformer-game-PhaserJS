const path = require("path");

module.exports = {
  entry: "./src/script.js",
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "public/"),
  },
};
