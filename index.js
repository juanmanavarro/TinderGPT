import { CronJob } from 'cron';
import dotenv from 'dotenv';
import { Config } from './sites/citas-online.info/config.js';
import { WpApi } from './shared/wp-api.js';
import { OpenAI } from './shared/openai.js';

dotenv.config();

const spanishDateApps = [
  'Tinder',
  'Badoo',
  'Meetic',
  'Bumble',
  'AdoptaUnChico',
  'Happn',
  'OkCupid',
  'POF',
  'eDarling',
  'Lovoo',
  'Hinge',
  'Grindr',
];

const randomDateApp = () => {
  const randomIndex = Math.floor(Math.random() * spanishDateApps.length);
  return spanishDateApps[randomIndex];
};

const newPublication = async () => {
  console.log('Publishing...');

  const lastTitles = WpApi.getLastPostTitles();
  const title = await (new OpenAI).generatePostTitle(
    Config.getTitlePrompt(lastTitles, { appTitle: randomDateApp() })
  );
  console.log(title);
  const content = await (new OpenAI).generatePostContent(title);
  console.log(content);
  // const status = await WpApi.publish(title, content);

  //   console.log('Script executed', status);
};

new CronJob(
	'30 14 * * *',
  newPublication,
	null,
	true,
	'Europe/Madrid'
);

// test dev
newPublication();
