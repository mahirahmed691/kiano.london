export type BagLine = {
  productId: string
  size: number
  quantity: number
}

export function holdBagLine(lines: BagLine[], productId: string, size: number): BagLine[] {
  const next = lines.filter(
    (line) =>
      typeof line.productId === 'string' &&
      typeof line.size === 'number' &&
      typeof line.quantity === 'number' &&
      line.quantity > 0,
  )
  const found = next.find((line) => line.productId === productId && line.size === size)
  if (found) {
    return next.map((line) =>
      line.productId === productId && line.size === size
        ? { ...line, quantity: Math.min(4, line.quantity + 1) }
        : line,
    )
  }
  return [...next, { productId, size, quantity: 1 }]
}

export function isCheckoutHref(href: string) {
  if (!href) return false
  try {
    const path = href.startsWith('/')
      ? href.split('?')[0]
      : new URL(href, 'https://www.kiano.london').pathname
    return path === '/checkout'
  } catch {
    return href.split('?')[0] === '/checkout'
  }
}

export function pieceIdFromHref(pathname: string) {
  const match = pathname.split('?')[0].match(/^\/(shop|collection)\/([^/]+)$/)
  return match?.[2] ?? ''
}

function tillMark() {
  return `
    window.__KIANO_NATIVE = true;
    try {
      var root = document.documentElement;
      root.classList.add('shell-app');
      root.style.setProperty('--header-offset', '0px');
      root.style.setProperty('--app-tab', '0px');
      var params = new URLSearchParams(window.location.search);
      var add = params.get('add');
      var size = Number(params.get('size'));
      var match = (window.location.pathname || '').match(/^\\/(shop|collection)\\/([^/]+)$/);
      var id = match && match[2];
      if (add === '1' && id && size) {
        var key = 'kiano.bag';
        var lines = [];
        try { lines = JSON.parse(localStorage.getItem(key) || '[]'); } catch (err) { lines = []; }
        if (!Array.isArray(lines)) lines = [];
        var found = false;
        for (var i = 0; i < lines.length; i++) {
          if (lines[i] && lines[i].productId === id && Number(lines[i].size) === size) {
            lines[i].quantity = Math.min(4, (Number(lines[i].quantity) || 0) + 1);
            found = true;
            break;
          }
        }
        if (!found) lines.push({ productId: id, size: size, quantity: 1 });
        localStorage.setItem(key, JSON.stringify(lines));
      }
      if (!window.__KIANO_TILL_CLICK) {
        window.__KIANO_TILL_CLICK = true;
        document.addEventListener('click', function (event) {
          var node = event.target;
          while (node && node !== document && node !== document.documentElement) {
            if (node.tagName === 'A') {
              var href = node.getAttribute('href') || '';
              var path = href;
              try {
                if (href) path = new URL(href, window.location.origin).pathname;
              } catch (err) {}
              if ((path.split('?')[0] === '/checkout') && window.ReactNativeWebView) {
                event.preventDefault();
                event.stopPropagation();
                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'kiano-checkout' }));
                return false;
              }
            }
            node = node.parentNode;
          }
        }, true);
      }
    } catch (e) {}
    window.dispatchEvent(new Event('kiano-native'));
  `
}

export function nativeMark() {
  return `
    ${tillMark()}
    true;
  `
}

export function pushBridge(token: string) {
  const encoded = JSON.stringify(token)
  return `
    ${tillMark()}
    window.__KIANO_EXPO_PUSH = ${encoded};
    window.dispatchEvent(new Event('kiano-expo-push'));
    true;
  `
}

export function addToBagScript(productId: string, size: number) {
  const id = JSON.stringify(productId)
  const value = JSON.stringify(size)
  return `
    (function () {
      window.__KIANO_NATIVE = true;
      try {
        var key = 'kiano.bag';
        var lines = [];
        try { lines = JSON.parse(localStorage.getItem(key) || '[]'); } catch (err) { lines = []; }
        if (!Array.isArray(lines)) lines = [];
        var found = false;
        for (var i = 0; i < lines.length; i++) {
          if (lines[i] && lines[i].productId === ${id} && Number(lines[i].size) === ${value}) {
            lines[i].quantity = Math.min(4, (Number(lines[i].quantity) || 0) + 1);
            found = true;
            break;
          }
        }
        if (!found) lines.push({ productId: ${id}, size: ${value}, quantity: 1 });
        localStorage.setItem(key, JSON.stringify(lines));
      } catch (err) {}
      window.dispatchEvent(new CustomEvent('kiano-add-to-bag', { detail: { productId: ${id}, size: ${value} } }));
      window.dispatchEvent(new Event('kiano-open-bag'));
      true;
    })();
  `
}
