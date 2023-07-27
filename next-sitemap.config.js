/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.DOMAIN || "https://localhost:3000",
    generateRobotsTxt: true,
    additionalSitemaps: [
        'content/sitemap.xml',
      ],
  };
  