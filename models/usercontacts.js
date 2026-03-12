const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('usercontacts', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    phone_number: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: "usercontacts_phone_number_key"
    },
    chat_id: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('client', 'provider', 'unknown'),
      allowNull: false,
      defaultValue: 'unknown'
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    location: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    service_details: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'usercontacts',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "usercontacts_phone_number_key",
        unique: true,
        fields: [
          { name: "phone_number" },
        ]
      },
      {
        name: "usercontacts_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
