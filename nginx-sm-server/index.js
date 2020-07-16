const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { createProxyMiddleware } = require('http-proxy-middleware');
const dataStorage = require('./libs/dataStorage');
const ReCaptcha = require('./libs/ReCaptcha');
const Utils = require('./libs/Utils');
const app = express();
const path = require('path');

// env variables
dotenv.config();

// static
app.use(express.static(__dirname + '/public'));

// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/api/login', async(req, res, next) => {
  try {
    const user = (dataStorage.users || []).filter(user => user.username === req.body.username)[0] || null;
    if (!req.body.recaptcha) throw new Error('Recaptcha is required.');
    if (!await ReCaptcha.verify(req.body.recaptcha, process.env.APP_RECAPTCHA_SECRET)) throw new Error('Invalid recaptcha.');
    if (!user || user.password !== req.body.password)  throw new Error('Incorrect username or password.');

    const second = 1000;
    const minute = 60 * second;
    const hour = 60 * minute;
    await res.json({
      token: jwt.sign({
        username: req.body.username,
        expireAt: new Date().getTime() + (2 * hour)
      }, process.env.APP_LOGIN_SECRET)
    });
  }
  catch (e) {
    next(e);
  }
});

app.use('/api/**', async (req, res, next) => {
  try {
    const token = req.headers.authorization || req.headers.Authorization;
    if (token) {
      const data = jwt.verify(token, process.env.APP_LOGIN_SECRET);
      if (new Date().getTime() >= data.expireAt) {
        throw new Error('Authorization has expired already.');
      }
      next();
    }
    else {
      throw new Error('Authorization is required.');
    }
  }
  catch (e) {
    next(e);
  }
});

app.get('/api/site', async(req, res, next) => {
  try {
    dataStorage.sites = dataStorage.sites || [];
    await res.json(dataStorage.sites);
  }
  catch (e) {
    next(e);
  }
});

app.post('/api/site', async(req, res, next) => {
  try {
    dataStorage.sites = dataStorage.sites || [];
    const newSite = {
      port: req.body.port || 80,
      name: req.body.name || ''
    };
    for (let site of dataStorage.sites) {
      if (site.port === newSite.port) {
        throw new Error(`Port ${site.port} already exists.`);
      }
      if (site.name === newSite.name) {
        throw new Error(`${site.name} already exists.`);
      }
    }
    dataStorage.sites.push(newSite);

    await Utils.saveNginxConfig({
      sites: dataStorage.sites,
      configPath: `${process.env.APP_NGINX_CONFIG_DIR}/${process.env.APP_NGINX_CONFIG_NAME}`
    });

    await res.json({
      message: 'Site has been successfully added.'
    });

    await Utils.restartNginx();
  }
  catch (e) {
    next(e);
  }
});

app.delete('/api/site/:name', async(req, res, next) => {
  try {
    let count = 0;
    dataStorage.sites = (dataStorage.sites || []).filter(item => {
      if (item.name === req.params.name) {
        count += 1;
        return false;
      }
      return true;
    });

    await Utils.saveNginxConfig({
      sites: dataStorage.sites,
      configPath: `${process.env.APP_NGINX_CONFIG_DIR}/${process.env.APP_NGINX_CONFIG_NAME}`
    });

    await res.json({
      count: count,
      message: `Site${count > 1 ? 's were' : ' was'} successfully deleted`
    });

    await Utils.restartNginx();
  }
  catch (e) {
    next(e);
  }
});

if (process.env.APP_STAGE === 'development') {
  app.get('/**', createProxyMiddleware({target: 'http://127.0.0.1:8080', ws: true}));
}
else {
  app.use(async (req, res, next) => {
    try {
      await res.sendFile(path.join(__dirname, '/public/index.html'));
    }
    catch (e) {
      next(e);
    }
  });
}

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    message: error.message
  });
});

const server = app.listen(Number(process.env.APP_PORT || 80), () => {
  console.log(`server started at port ${server.address().port}`);
});