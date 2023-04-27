export class Config {
  static prefix = 'CITAS_ONLINE_';

  static getTitlePrompt(lastTitles, data = null) {
    return `Dame el titulo para un post de un blog sobre la aplicacion de citas ${data.appTitle}, que sea totalmente diferente a cualquiera de estos: ${lastTitles}`;
  }
}
