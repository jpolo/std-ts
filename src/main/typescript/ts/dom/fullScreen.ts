
interface IFullScreenModule {
  isEnabled(): boolean;
  getElement(): HTMLElement;
  request(element?: HTMLElement): void;
  exit(): void;
}

function fullScreenProvider(document: Document): IFullScreenModule {

  const ELEMENT = _findProperty(document, [
    'fullscreenElement',
    'webkitFullscreenElement',
    'webkitCurrentFullScreenElement',
    'mozFullScreenElement',
    'msFullscreenElement'
  ]);
  const REQUEST = _findProperty(document.createElement('div'), [
    'requestFullScreen',
    'webkitRequestFullScreen',
    'webkitEnterFullscreen',
    'mozRequestFullScreen',
    'msRequestFullScreen'
  ]);
  const EXIT = _findProperty(document, [
    'exitFullScreen',
    'webkitCancelFullScreen',
    'webkitExitFullScreen',
    'mozCancelFullScreen',
    'msCancelFullScreen',
    'msExitFullscreen'
  ]);
  const ENABLED = _findProperty(document, [
    'fullscreenEnabled',
    'webkitFullscreenEnabled',
    'webkitIsFullScreen',
    'mozFullScreen',
    'msFullscreenEnabled'
  ]);

  function _findProperty(o: any, propNames: Array<string>) {
    let returnValue: string;
    let propName: string;
    for (let i = 0, l = propNames.length; i < l; ++i) {
      propName = propNames[i];
      if (propName in o) {
        returnValue = propName;
        break;
      }
    }
    return returnValue;
  }

  return (
    document ?
    {
      isEnabled() {
        return !!document[ENABLED];
      },
      getElement() {
        return document[ELEMENT] || null;
      },
      request(opt_element) {
        (opt_element || document.documentElement)[REQUEST]();
      },
      exit() {
        document[EXIT]();
      }
    } :
    {
      isEnabled() {
        return false;
      },
      getElement() {
        return null;
      },
      request(opt_element) {
        return undefined;
      },
      exit() {
        return undefined;
      }
    });
  }
  const fullScreen = fullScreenProvider(document);

  /**
   * Returns true if document has the ability to display elements fullscreen, or false otherwise.
   *
   */
  export function isEnabled() {
    return fullScreen.isEnabled();
  }

  /**
   * Returns the element that is displayed fullscreen, or null if there is no such element
   *
   */
  export function getElement() {
    return fullScreen.getElement();
  }

  /**
   * Displays element fullscreen.
   *
   * @param element
   */
  export function request(element: HTMLElement) {
    fullScreen.request(element);
  }

  /**
   * Exit fullScreen mode
   */
  export function exit() {
    fullScreen.exit();
  }
