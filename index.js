import { CronJob } from 'cron';
import dotenv from 'dotenv';
import fs from 'fs';
import { WpApi } from './shared/wp-api.js';
import { OpenAI } from './shared/openai.js';

dotenv.config();

console.log('Starting cron job...');

const newPublication = async () => {
  const sites = fs.readdirSync('./sites');
  for (const site of sites) {
    console.log(`Publishing ${site}...`);

    const { default: Site } = await import(`./sites/${site}/index.js`);
    if ( !Site.production ) {
      console.log(`Skipping ${site} because it's not in production mode`);
      continue;
    }

    const generator = new OpenAI();
    const api = new WpApi(Site);

    const lastTitles = await api.getLastPostTitles();
    const titlePrompt = Site.getTitlePrompt(lastTitles);
    const title = await generator.generatePostTitle(titlePrompt);
    const postPrompt = Site.getPostPrompt(title);
    const content = await generator.generatePostContent(postPrompt);
    if ( !title || !content ) {
      console.log(`Skipping ${site} because title or content is empty`);
      continue;
    }

    const response = await api.publish(title, content);

    console.log(`Published "${title}" at site ${site} with status ${response.status}`);
  }
};

new CronJob(
	'0 */12 * * *',
  newPublication,
	null,
	true,
	'Europe/Madrid'
);

// test dev
if ( process.env.DEV ) {
  newPublication();
}
