import { CronJob } from 'cron';
import dotenv from 'dotenv';
import { WpApi } from './shared/wp-api.js';
import { OpenAI } from './shared/openai.js';

dotenv.config();

const newPublication = async () => {
  console.log('Publishing...');

  const { default: Site } = await import('./sites/citas-online.info/index.js');
  const generator = new OpenAI();
  const api = new WpApi();

  const lastTitles = api.getLastPostTitles();
  const titlePrompt = Site.getTitlePrompt(lastTitles);
  const title = await generator.generatePostTitle(titlePrompt);
  const content = await generator.generatePostContent(title);
  const status = await api.publish(title, content);

  console.log('Script executed', status);
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
