const fs = require("fs");
const htmlmin = require("html-minifier");

const pluginSEO = require("eleventy-plugin-seo");

const { DateTime } = require("luxon");

const Cite = require("citation-js");
const Autolinker = require("autolinker");

const parseCitations = async (content) => {
  let bibtexCounter = 1;

  // Parse bibtex string
  let input = await Cite.inputAsync(content);
  // Citation.js required unique IDs, so make sure they're unique.
  // I've always used "src" as ID, showing my BibTex incompetence.
  //input.map((e) => (e.id = bibtexCounter++));

  // Put in Cite object and get HTML out of it!
  const data = new Cite(input);
  input = input.sort((entryA, entryB) => {
    return (
      parseInt(entryA["issued"]["date-parts"][0][0]) -
      parseInt(entryB["issued"]["date-parts"][0][0])
    );
  });
  console.log(input);
  const html = data.format("bibliography", {
    format: "html",
    template: "apa",
    lang: "en-US",
    nosort: true,
  });

  // Convert all links in the output HTML to actual <a> tags
  return Autolinker.link(html, {
    newWindow: true,
    email: false,
    phone: false,
    stripPrefix: false,
    stripTrailingSlash: false,
    className: "no-underline",
  });
};

module.exports = function (eleventyConfig) {
  if (process.env.ELEVENTY_PRODUCTION) {
    eleventyConfig.addTransform("htmlmin", htmlminTransform);
  } else {
    eleventyConfig.setBrowserSyncConfig({
      callbacks: { ready: browserSyncReady },
    });
  }

  // Passthrough
  eleventyConfig.addPassthroughCopy({ "src/static": "." });
  eleventyConfig.addDataExtension("bib", (c) => parseCitations(c));

  eleventyConfig.addPlugin(pluginSEO, require("./src/_data/seo.json"));
  // Watch targets
  eleventyConfig.addWatchTarget("./src/styles/");

  eleventyConfig.addFilter("formatDate", (dateObj) => {
    return (
      DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("dd-LL-yyyy") || ""
    );
  });

  var pathPrefix = "";
  if (process.env.GITHUB_REPOSITORY) {
    pathPrefix = process.env.GITHUB_REPOSITORY.split("/")[1];
  }

  return {
    dir: {
      input: "src",
    },
    pathPrefix,
  };
};

function browserSyncReady(err, bs) {
  bs.addMiddleware("*", (req, res) => {
    const content_404 = fs.readFileSync("_site/404.html");
    // Provides the 404 content without redirect.
    res.write(content_404);
    // Add 404 http status code in request header.
    // res.writeHead(404, { "Content-Type": "text/html" });
    res.writeHead(404);
    res.end();
  });
}

function htmlminTransform(content, outputPath) {
  if (outputPath.endsWith(".html")) {
    let minified = htmlmin.minify(content, {
      useShortDoctype: true,
      removeComments: true,
      collapseWhitespace: true,
    });
    return minified;
  }
  return content;
}
