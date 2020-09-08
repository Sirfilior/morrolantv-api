const fs = require("fs");
const moment = require("moment");
const express = require("express");
const { createLogger, format, transports } = require('winston');
var cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5100;

//--------------------------------------------- 
//Start CORS Setup
//--------------------------------------------- 
var allowedOrigins = [
  "http://localhost:3000",
  "https://morrolantv-dev.herokuapp.com",
  "https://eloquent-keller-9336f4.netlify.app"
];
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);
//End CORS Setup
//--------------------------------------------- 



//--------------------------------------------- 
//Start LOG Setup
//--------------------------------------------- 
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: 'morro-api' },
  transports: [
    //
    // - Write to all logs with level `info` and below to `quick-start-combined.log`.
    // - Write all logs error (and below) to `quick-start-error.log`.
    //
    new transports.File({ filename: './log/api-error.log', level: 'error' }),
    new transports.File({ filename: './log/api-info.log', options: { flags: 'w' } })
  ]
});

//
// If we're not in production then **ALSO** log to the `console`
// with the colorized simple format.
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple()
    )
  }));
}
//End LOG Setup
//--------------------------------------------- 

const MARKET = require("./custom_modules/marketplace");
const market = new MARKET.Market();

const { Item } = require('bdo-scraper');

const CACHE_LIFETIME_MIN = 60;
const MARKETPLACE_REQUEST_DELAY_MS = 50;

//Import static json data
const groups = require("./resources/recipes/groups.json");
const recipes = require("./resources/recipes/cooking.json");
const nodes = require("./resources/nodes.json");

//Items to get scrape and market data for
const whitelist = require("./resources/whitelist.json");

//Item info storage with codex and marketplace
const cache = require("./resources/cache.json");

app.get("/combinations", (req, res) => {});

app.get("/recipes", (req, res) => {
  logger.log('info', 'Accessed %s - at %s', 'recepies', new Date());
  const combined = recipes.map((recipe) => {
    const materials = recipe.materials.map((material) => {
      if (!material.group){
        return { quantity: material.quantity, ...getFromCache(material.id) };
      }
      const rawGroup = getGroup(material.id);
      const group = rawGroup.items.map((item) => getFromCache(item.id));
      return { ...material, group, name: rawGroup.name };
    });

    const products = recipe.products.map((product) => {
      return { ...product, ...getFromCache(product.id) };
    });
    return { ...recipe, materials, products };
  });

  res.json(combined);
});

app.get("/nodes", (req, res) => {
  logger.log('info', 'Accessed %s - at %s', 'nodes', new Date());
  const combined = nodes.map((node) => {
    const materials = node.materials.map((material) =>
      getFromCache(material.id)
    );
    return { ...node, materials };
  });

  res.json(combined);
});

// Heroku basic setup
app.listen(PORT, () => console.log(`Listening on ${PORT}`));

//Start writing to cache
async function dataToCache() {
  //Check cach for each item on load once
  whitelist.forEach((x, i) => setTimeout(() => addToCache(x), i * MARKETPLACE_REQUEST_DELAY_MS));
  //After set time, check state of cache for each item again
  //Time is cache expire plus 3 seconds spare
  setInterval(() => {
    whitelist.forEach((x, i) => setTimeout(() => addToCache(x), i * MARKETPLACE_REQUEST_DELAY_MS));
  }, CACHE_LIFETIME_MIN * 60000 + 3000);
}

function getFromCache(id) {
  const index = cache.findIndex((x) => x.id == id);
  if (index == -1) return addToCache(id);
  return cache[index];
}

async function addToCache(id) {
  const index = cache.findIndex((x) => x.id == id);
  let error = false;
  let codexInfo;
  let marketPrice;

  if (index == -1) {
    //Item is not in cache
    try {
      codexInfo = await getItemFromCodex(id);  
    } catch (error) {
      logger.log('error', new Error('Could not get item from codex'));
      error = true;
    }
    try {
      marketPrice = await market.fetchItemById(id).then((x) => x[0]);  
    } catch (error) {
      logger.log('error', new Error('Could not get item from marketplace'));
      error = true;
    }
    cache.push({ id, marketPrice, codexInfo, updated: new Date() });
  } else if (after(CACHE_LIFETIME_MIN, cache[index].updated)) {
    //Item is in cache, but updated longer than an hour ago
    cache[index].updated = new Date();
    //Codex info needs no refreshing if still in cache
    let codex = cache[index].codexInfo;
    if(!codex) {
      logger.log('info', 'Get for existing cache %s - at %s', 'Missing Codex',  new Date());
      codex =  await getItemFromCodex(id);
    }
    try {
      logger.log('info', 'Get for existing cache %s - at %s', 'Marketplace',  new Date());
      const marketPrice = await market.fetchItemById(id).then((x) => x[0]);
      cache[index] = { id, marketPrice, codex, updated: new Date() };
    } catch (error) {
      error = true;
      logger.log('error', new Error('Could not get item from marketplace for refreshing cache'));
    }
    
  }
  if(!error) fs.writeFileSync("./resources/cache.json", JSON.stringify(cache), "utf8");
}

async function getItemFromCodex(id) {
  const codexItem = await Item(id);
  const codex = {
    name: codexItem.data.name,
    icon: codexItem.data.icon,
    prices: codexItem.data.prices,
  };
  return codex;
}

function getGroup(id) {
  const index = groups.findIndex((group) => group.id == id);
  if (index == -1) throw new Error("Invalid Group ID Provided");
  return groups[index];
}

function after(minutes, date) {
  return moment(date).isBefore(moment().subtract(minutes, "minutes"));
}

dataToCache();
