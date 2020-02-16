'use strict';
module.exports = (sequelize, DataTypes) => {
  const Campaign = sequelize.define('Campaign', {
    name: DataTypes.STRING,
    trendingLocation: DataTypes.STRING,
    customSearchTerm: DataTypes.STRING,
    frequency: DataTypes.FLOAT,
    includeTargetHandle: DataTypes.BOOLEAN,
    includeTargetHashtag: DataTypes.BOOLEAN,
    customHashtags: DataTypes.BOOLEAN,
    // tweets: DataTypes.JSON,
    tweets: DataTypes.ARRAY(DataTypes.JSON),
    mad: DataTypes.BOOLEAN
  }, {});
  Campaign.associate = function(models) {
    // associations can be defined here
  };
  return Campaign;
};