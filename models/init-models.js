var DataTypes = require("sequelize").DataTypes;
var _usercontacts = require("./usercontacts");

function initModels(sequelize) {
  var usercontacts = _usercontacts(sequelize, DataTypes);


  return {
    usercontacts,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
