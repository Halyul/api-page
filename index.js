/**
 * Init Koa base
 */
const Koa = require('koa');
const render = require('koa-ejs');
const serve = require('koa-static');
const locale = require('koa-locale') //  detect the locale
const i18n = require('koa-i18n')
const path = require('path');
const app = new Koa();
app.proxy = true;
const rp = require('request-promise');
const jsonfile = require('jsonfile');
const yaml = require('js-yaml');
const fs = require('fs');
const config = yaml.safeLoad(fs.readFileSync('./_config.yml', 'utf8'));

locale(app);

app.use(i18n(app, {
  directory: './locales',
  locales: config.locales,
  modes: [
    'query'
  ]
}));

render(app, {
  root: path.join(__dirname, 'theme'),
  layout: 'layout',
  viewExt: 'ejs',
  cache: false,
  debug: false
});

app.use(
  serve(__dirname + '/semantic/dist')
);

app.use(
  serve(__dirname + '/public')
);

app.use(async ctx => {
  const apis = yaml.safeLoad(fs.readFileSync('./apis.yml', 'utf8'));
  const data = {
    i18n: ctx.i18n,
    config,
    apis
  };

  if (config.locales.length !== 1) {
    data.locale = ctx.getLocaleFromQuery()
  } else {
    data.locale = null;
  }

  if (config.track) {
    await rp(config.track)
      .then(async function (json) {
          data.track = JSON.parse(json);
          await ctx.render('index', data);
      })
      .catch(function (err) {
          console.log(err);
      });
  } else {
    data.track = null;
    await ctx.render('index', data)
  };
});

/**
 * Development server
 */
if (process.env.DEV) {
  const devServer = new Koa();
  const devPort = (config.port + 1) || 3001;
  devServer.listen(devPort, function() {
    console.log('Development server listening on', devPort);
  });
  devServer.use(async devCtx => {
    const devObj = jsonfile.readFileSync('./data.json', {throws: false});
    devCtx.body = devObj;
  });
}

const port = config.port || 3000;
app.listen(port, function() {
  console.log('Server listening on', port);
});
