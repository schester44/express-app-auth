export type RedirectionPageOptions = {
  origin: string;
  redirectTo: string;
  apiKey: string;
};

export default function redirectionScript({
  origin,
  redirectTo,
  apiKey,
}: RedirectionPageOptions) {
  return `
    <script src="https://unpkg.com/cchd-applink@0.1.0/dist/applink.umd.production.min.js"></script>

    <script type="text/javascript">
      document.addEventListener('DOMContentLoaded', function() {
        if (window.top === window.self) {
          // If the current window is the 'parent', change the URL by setting location.href
          window.location.href = "${redirectTo}";
        } else {
          // If the current window is the 'child', change the parent's URL with postMessage
          var createApp = window.AppLink.default;
          var Redirect = window.AppLink.Redirect;
          
          var app = createApp({
            apiKey: "${apiKey}",
            accountOrigin: "${encodeURI(origin)}",
          });

          Redirect.create(app).dispatch(Redirect.Action.Remote, "${redirectTo}")
        }
      });
    </script>
  `;
}
