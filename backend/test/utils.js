const { assert } = require("chai");

const clearCollections = async (models) => {
  return await models.map(async (model) => {
    await model.deleteMany({});
    return await model.find();
  });
};

exports.checkIfCollectionsCleared = async (models) => {
  const collections = await clearCollections([...models]);

  for (let coll of collections) {
    assert.isEmpty(coll);
  }
};