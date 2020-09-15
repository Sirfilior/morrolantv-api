"use strict";

const sequelize = require("../db");
const { Node, User, UserNode } = sequelize.models;
//TODO: Turn into cron job for 30min, only update marketPrices
//This script is fetching item data from both codex and marketplace.
//After this the materials table will be set
//Run this script before importing other game data, to set associations!

async function createUser() {
  try {
    await User.sync({ force: true });
    await User.create({
      username: "testuser",
    });
  } catch (error) {
    console.log(error);
  }
}

async function createUserNode() {
  try {
    const user = await User.findOne({ where: { username: "testuser" } });
    await UserNode.sync({ force: true });
    const usernode = await UserNode.create({
      contribution: 2,
      workload: 50,
      averageYield: 100,
      workspeed: 0,
      NodeId: 1,
    });
    await user.addUserNode(usernode);
  } catch (error) {
    console.log(error);
  }
}

async function main() {
  var t0 = new Date().getTime();
  await createUser();
  await createUserNode();
  await sequelize.close();
  var t1 = new Date().getTime();
  console.log(`Testusers done! It took ${(t1 - t0) / 1000} seconds`);
}

//This script should be used local, then copy database
if (process.env.NODE_ENV != "production") {
  main();
}