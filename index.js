import { CronJob } from 'cron';
import dotenv from 'dotenv';
import fs from 'fs';
import { WpApi } from './shared/wp-api.js';
import { OpenAI } from './shared/openai.js';

dotenv.config();

const newPublication = async () => {
  // return all index.js paths in sites folder
  const sites = fs.readdirSync('./sites');
  for (const site of sites) {
    console.log(`Publishing ${site}...`);

    const { default: Site } = await import(`./sites/${site}/index.js`);
    if ( !Site.production ) {
      console.log(`Skipping ${site} because it's not in production mode`);
      return;
    }

    const generator = new OpenAI();
    const api = new WpApi(Site.prefix, Site.apiUrl);

    const lastTitles = await api.getLastPostTitles();
    const titlePrompt = Site.getTitlePrompt(lastTitles);
    const title = await generator.generatePostTitle(titlePrompt);
    // const content = await generator.generatePostContent(title);
    // const status = await api.publish(title, content);

    console.log(`Published "${title}" at site ${site}`);
  }
};

new CronJob(
	'30 14 * * *',
  newPublication,
	null,
	true,
	'Europe/Madrid'
);

// test dev
if ( process.env.DEV ) {
  newPublication();
}
