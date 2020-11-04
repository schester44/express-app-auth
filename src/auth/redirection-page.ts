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
    <script type="text/javascript">
      document.addEventListener('DOMContentLoaded', function() {
        if (window.top === window.self) {
          // If the current window is the 'parent', change the URL by setting location.href
          window.location.href = "${redirectTo}";
        } else {
          // If the current window is the 'child', change the parent's URL with postMessage
         
          function createApp(options) {
            return {
              getState: () => {
                // promise that returns current state, including currently logged in user
              },
              dispatch: (action) => {
                // TODO: The postMessage origin needs to be the accountOrigin
                // FIXME: How to make it work in dev when we have multiple different ports?
                parent.postMessage({ action, app: options }, '*')
              }
            }
          }

          const Redirect = {
            toRemote: ({ url }) => ({
              type: 'REMOTE_REDIRECT',
              payload: { url }
            })
          }

          var app = createApp({
            apiKey: "${apiKey}",
            accountOrigin: "${encodeURI(origin)}",
          });

          app.dispatch(Redirect.toRemote({ url: "${redirectTo}" }))
        }
      });
    </script>
  `;
}
