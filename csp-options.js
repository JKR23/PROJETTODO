let options = {};

if (process.env.NODE_ENV === "development") {
 options = {
  contentSecurityPolicy: {
   directives: {
    defaultSrc: ["'self'"],
    baseUri: ["'self'"],
    blockAllMixedContent: [],
    fontSrc: ["'self'", "https:", "data:"],
    frameAncestors: ["'self'"],
    imgSrc: ["'self'", "data:"],
    objectSrc: ["'none'"],
    scriptSrc: ["'self'", "'nonce-browser-sync'"],
    scriptSrcAttr: ["'none'"],
    styleSrc: ["'self'", "https:", "'unsafe-inline'"],
    connectSrc: ["'self'", "localhost:5000", "http://localhost:5000"],
    upgradeInsecureRequests: [],
   },
  },
 };
}

export default options;
