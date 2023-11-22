var fileCache = require("file-system-cache").default({ ttl: 7 * 24 * 3600 });

module.exports = {
  init: function () {
    this.cache = fileCache;
  },

  requestReceived: function (req, res, next) {
    this.cache
      .get(req.prerender.url)
      .then((result) => {
        if (result) {
          req.prerender.cacheHit = true;
          res.send(200, result);
        } else {
          next();
        }
      })
      .catch((err) => {
        next();
      });
  },

  beforeSend: function (req, res, next) {
    if (!req.prerender.cacheHit && req.prerender.statusCode == 200) {
      this.cache.set(req.prerender.url, req.prerender.content);
    }
    next();
  },
};
