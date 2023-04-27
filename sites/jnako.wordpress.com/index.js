export default class Site {
  static production = true;
  static url = 'https://jnako.wordpress.com/';
  static apiUrl = 'https://public-api.wordpress.com/rest/v1.1/sites/jnako.wordpress.com';
  static prefix = 'CITAS_ONLINE_INFO_';

  static getTitlePrompt(lastTitles) {
    return `Dame el titulo para un post de un blog sobre la aplicacion de citas Tinder, que sea totalmente diferente a cualquiera de estos: ${lastTitles}`;
  }
}