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
const jsonfile = require('jsonfile');
const yaml = require('js-yaml');
const fs   = require('fs');
const config = yaml.safeLoad(fs.readFileSync('./_config.yml', 'utf8'));

locale(app);

app.use(i18n(app, {
  directory: './locales',
  locales: ['zh-CN', 'en'], //  `zh-CN` defualtLocale, must match the locales to the filenames
  modes: [
    'url'
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
  const track = jsonfile.readFileSync("./data.json", {throws: false});
  await ctx.render('index', {
    i18n: ctx.i18n,
    config,
    apis,
    track
  })
});

const port = config.port || 3000;
app.listen(port, function() {
  console.log('Server listening on', port);
});
