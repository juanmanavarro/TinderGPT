import axios from 'axios';
import { Config } from '../sites/citas-online.info/config.js';

export class WpApi {
  client;

  constructor() {
    this.client = axios.create({
      baseURL: '',
      headers: {
        Authorization: `Bearer ${process.env[`${Config.prefix}WP_API_TOKEN`]}`
      },
    });
  }

  async getLastPostTitles() {
    try {
      const response = await axios.get(`${process.env[`${Config.prefix}WP_URL`]}/posts`, {
        params: {
          fields: 'title',
          number: 10,
        },
      });

      return response.data.posts.map(p => p.title).join(', ');
    } catch (error) {
      console.error(error);
    }
  }

  async publish(title, content) {
    try {
      const { status } = await axios.post(`${process.env[`${Config.prefix}WP_URL`]}/posts/new`, {
        title,
        content,
      });
      return status;
    } catch (error) {
      console.log(error);
    }
  }
}
