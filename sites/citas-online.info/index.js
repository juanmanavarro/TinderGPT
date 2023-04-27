export default class Site {
  static production = true;

  static url = 'https://citas-online.info';
  static apiUrl = 'https://citas-online.info/wp-json/wp/v2';
  static prefix = 'CITAS_ONLINE_INFO_';

  static spanishDateApps = [
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

  static getTitlePrompt(lastTitles) {
    const randomIndex = Math.floor(Math.random() * this.spanishDateApps.length);
    return `Eres un experto en estas aplicaciones de citas: ${this.spanishDateApps.join(', ')}. Las has usado todas. Sabes todo de como funcionan y trucos para usarlas mas eficientemente. Vas a escribir un blog sobre toda la experiencia que tienes, de una manera amena. Dame el titulo para un post de un blog sobre la aplicacion de citas ${this.spanishDateApps[randomIndex]}, que sea totalmente diferente a cualquiera de estos: ${lastTitles}`;
  }

  static getPostPrompt(title) {
    return `Eres un experto en estas aplicaciones de citas: ${this.spanishDateApps.join(', ')}. Las has usado todas. Sabes todo de como funcionan y trucos para usarlas mas eficientemente. Vas a escribir un blog sobre toda la experiencia que tienes, de una manera amena. Escribe un post de unas 500 palabras sobre ${title}`;
  }
}
