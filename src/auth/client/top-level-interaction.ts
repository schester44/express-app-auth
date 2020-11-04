const topLevelInteraction = (account: string, prefix = "") => {
  return `(function() {
      function setUpTopLevelInteraction() {
        var TopLevelInteraction = new ITPHelper({
          redirectUrl: "${prefix}/auth?account=${encodeURIComponent(account)}",
        });
        TopLevelInteraction.execute();
      }
      document.addEventListener("DOMContentLoaded", setUpTopLevelInteraction);
    })();`;
};

export default topLevelInteraction;
