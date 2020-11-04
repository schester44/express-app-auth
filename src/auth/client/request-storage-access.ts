const requestStorageAccess = (account: string, prefix = "/") => {
  return `(function() {
      function redirect() {
        var targetInfo = {
          appUrl: "https://${encodeURIComponent(account)}",
          hasStorageAccessUrl: "${prefix}auth/inline?account=${encodeURIComponent(
    account
  )}",
          doesNotHaveStorageAccessUrl: "${prefix}auth/enable_cookies?account=${encodeURIComponent(
    account
  )}",
          appTargetUrl: "${prefix}?account=${encodeURIComponent(account)}"
        }
        if (window.top == window.self) {
          // If the current window is the 'parent', change the URL by setting location.href
          window.top.location.href = targetInfo.hasStorageAccessUrl;
        } else {
          var storageAccessHelper = new StorageAccessHelper(targetInfo);
          storageAccessHelper.execute();
        }
      }
      document.addEventListener("DOMContentLoaded", redirect);
    })();`;
};

export default requestStorageAccess;
