export default class Site {
  static production = true;

  static url = 'https://citas-online.info';
  static apiUrl = 'https://citas-online.info/wp-json/wp/v2';
  static prefix = 'CITAS_ONLINE_INFO_';

  static getTitlePrompt(lastTitles) {
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

    const randomIndex = Math.floor(Math.random() * spanishDateApps.length);

    return `Dame el titulo para un post de un blog sobre la aplicacion de citas ${spanishDateApps[randomIndex]}, que sea totalmente diferente a cualquiera de estos: ${lastTitles}`;
  }
}
