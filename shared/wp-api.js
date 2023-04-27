import axios from 'axios';
import { Config } from '../sites/citas-online.info/config.js';

export class WpApi {
  static async getLastPostTitles() {
    try {
      const response = await axios.get(`${process.env[`${Config.prefix}WP_URL`]}/posts`, {
        headers: {
          Authorization: `Bearer ${process.env[`${Config.prefix}WP_API_TOKEN`]}`
        },
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
}
