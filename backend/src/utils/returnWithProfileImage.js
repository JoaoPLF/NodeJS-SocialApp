const { getProfileImage } = require("../controllers/user.controller");

const returnWithProfileImage = async (document) => {
  const profileImage = await getProfileImage(document.userHandle);
  return { ...document.toJSON(), profileImage };
};

module.exports = returnWithProfileImage;