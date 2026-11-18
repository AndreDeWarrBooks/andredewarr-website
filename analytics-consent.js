/* Optional Google Analytics: do not load Google until the visitor accepts. */
(function () {
  'use strict';
  var id = 'G-3Q15SJX7WS';
  var key = 'adw-analytics-choice-v1';
  var ttl = 180 * 24 * 60 * 60 * 1000;
  var loaded = false;
  var memory = null;
  function preference() {
    try {
      var value = JSON.parse(localStorage.getItem(key));
      if (value && Date.now() - value.time < ttl &&
          (value.choice === 'accept' || value.choice === 'reject')) return value.choice;
    } catch (e) {}
    return memory;
  }
  function remember(choice) {
    memory = choice;
    try { localStorage.setItem(key, JSON.stringify({choice: choice, time: Date.now()})); } catch (e) {}
  }
  function startAnalytics() {
    if (loaded || preference() !== 'accept') return;
    loaded = true;
    window['ga-disable-' + id] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {
      analytics_storage: 'granted', ad_storage: 'denied',
      ad_user_data: 'denied', ad_personalization: 'denied'
    });
    window.gtag('js', new Date());
    window.gtag('config', id, {
      allow_google_signals: false, allow_ad_personalization_signals: false,
      cookie_expires: 15552000, cookie_update: false
    });
    var tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    document.head.appendChild(tag);
  }
  function clearAnalyticsCookies() {
    var names = document.cookie.split(';').map(function (s) {return s.trim().split('=')[0];});
    names.forEach(function (name) {
      if (!/^_ga(?:_|$)/.test(name)) return;
      var expiration = name + '=; Max-Age=0; Path=/; SameSite=Lax';
      document.cookie = expiration;
      document.cookie = expiration + '; Domain=' + location.hostname;
      document.cookie = expiration + '; Domain=andredewarrbooks.com';
    });
  }
  function initialise() {
    var css = document.createElement('style');
    css.textContent = '#adw-cookie-panel{position:fixed;bottom:16px;left:16px;right:16px;max-width:600px;margin:auto;z-index:10000;background:#fdfbf7;color:#101722;border:1px solid #c7b99f;border-radius:10px;box-shadow:0 6px 24px #0003;padding:16px;font:15px/1.5 Arial,sans-serif;text-align:left}#adw-cookie-panel[hidden]{display:none!important}#adw-cookie-panel h2{font:700 20px/1.25 Georgia,serif;margin:0 0 6px}#adw-cookie-panel p{margin:6px 0;font-size:14px}#adw-cookie-panel a{color:#17212c;text-decoration:underline}#adw-cookie-panel .adw-cookie-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:12px}#adw-cookie-panel button{flex:1;min-width:125px;cursor:pointer;border:1px solid #17212c;border-radius:5px;background:#17212c;color:#fff;padding:10px 13px;font:600 14px Arial,sans-serif}#adw-cookie-panel button:focus-visible,#adw-cookie-settings:focus-visible{outline:3px solid #a34f39;outline-offset:3px}#adw-cookie-settings{font:inherit;color:inherit;background:none;border:0;padding:3px;text-decoration:underline;cursor:pointer}#adw-cookie-panel details{font-size:13px;margin-top:8px}#adw-cookie-panel summary{cursor:pointer}';
    document.head.appendChild(css);
    var panel = document.createElement('section');
    panel.id = 'adw-cookie-panel';
    panel.setAttribute('role','region');
    panel.setAttribute('aria-labelledby','adw-cookie-title');
    panel.hidden = true;
    panel.innerHTML = '<h2 id="adw-cookie-title">Your cookie choices</h2><p>We use optional Google Analytics cookies to understand how people find our books and use this website. You can accept or reject them; either way, you can browse and shop as usual.</p><details><summary>More about analytics and privacy</summary><p>If you accept, Google receives website usage information, such as pages visited, referral sources and link clicks. Google Analytics uses first-party cookies (including _ga and _ga_*); we configure them to expire after 180 days. We store your preference on this device for 180 days. Advertising personalisation is disabled. We also use existing cookieless Cloudflare Web Analytics for basic website performance and traffic.</p><p>Learn how <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">Google uses data</a> and read <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">Cloudflare’s privacy policy</a>. For questions, contact <a href="mailto:contact@andredewarrbooks.com">contact@andredewarrbooks.com</a>. You can change your choice at any time using Cookie settings in the footer.</p></details><div class="adw-cookie-actions"><button type="button" id="adw-cookie-reject">Reject analytics</button><button type="button" id="adw-cookie-accept">Accept analytics</button></div>';
    document.body.appendChild(panel);
    var footer = document.querySelector('footer') || document.body;
    var settings = document.createElement('button');
    settings.type = 'button';
    settings.id = 'adw-cookie-settings';
    settings.textContent = 'Cookie settings';
    settings.setAttribute('aria-controls', panel.id);
    settings.setAttribute('aria-expanded','false');
    var wrap = document.createElement('div');
    wrap.style.cssText = 'text-align:center;padding:6px 12px';
    wrap.appendChild(settings);
    footer.appendChild(wrap);
    function show() {
      panel.hidden = false;
      settings.setAttribute('aria-expanded','true');
    }
    function hide() {
      panel.hidden = true;
      settings.setAttribute('aria-expanded','false');
    }
    settings.addEventListener('click', function () {
      if (panel.hidden) {show(); document.getElementById('adw-cookie-reject').focus();}
      else hide();
    });
    document.getElementById('adw-cookie-accept').addEventListener('click', function () {
      remember('accept'); hide(); startAnalytics(); settings.focus();
    });
    document.getElementById('adw-cookie-reject').addEventListener('click', function () {
      var wasLoaded = loaded;
      window['ga-disable-' + id] = true;
      remember('reject'); clearAnalyticsCookies(); hide();
      if (wasLoaded) location.reload(); else settings.focus();
    });
    window.addEventListener('storage', function (event) {
      if (event.key === key && loaded && preference() !== 'accept') {
        window['ga-disable-' + id] = true;
        clearAnalyticsCookies();
        location.reload();
      }
    });
    if (preference() === 'accept') startAnalytics();
    else if (preference() === 'reject') clearAnalyticsCookies();
    else {clearAnalyticsCookies(); show();}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialise);
  else initialise();
})();
