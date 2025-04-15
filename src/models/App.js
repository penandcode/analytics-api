const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const App = sequelize.define('App', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: uuidv4
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  apiKey: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  expirationDate: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'apps',
  timestamps: true
});

module.exports = App;
