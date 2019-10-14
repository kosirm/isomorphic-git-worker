importScripts(
  "https://isomorphic-git.org/js/browserfs.js",
  "https://unpkg.com/isomorphic-git",
  "https://unpkg.com/magic-portal"
);

let fsOptions = {
  fs: "IndexedDB",
  options: {}
};

BrowserFS.configure(fsOptions, async function(err) {
  if (err) return console.log(err);

  // Initialize isomorphic-git
  const fs = BrowserFS.BFSRequire("fs");
  git.plugins.set("fs", fs);

  const portal = new MagicPortal(self);
  let emitter = await portal.get("emitter");
  git.plugins.set("emitter", emitter);

  let credentialManager = await portal.get("credentialManager");
  git.plugins.set("credentialManager", credentialManager);

  fs.getRootFS().empty(() => {
    fs.mkdir("/", () => {
      portal.set("git", git);
    });
  });
});

self.addEventListener("message", ({ data }) => console.log(data));
