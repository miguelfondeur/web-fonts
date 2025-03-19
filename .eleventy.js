const fs = require("fs");
const path = require("path");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const esbuild = require("esbuild");

// CSS bundling function
async function bundleCss() {
    const result = await esbuild.build({
        entryPoints: ["src/css/styles.css"],
        bundle: true,
        minify: true,
        outfile: "public/css/styles.min.css",
        loader: {
            ".css": "css"
        }
    });
    return result;
}

module.exports = function(eleventyConfig) {
    //Syntax Highlighting
    eleventyConfig.addPlugin(syntaxHighlight);

    // Copy Manifest File
    eleventyConfig.addPassthroughCopy({ "src/netlify": "netlify" });

    // Copy all images from 'src/assets/img' to 'public/img'
    eleventyConfig.addPassthroughCopy({ "src/img": "img" });

    // Copy JS
    eleventyConfig.addPassthroughCopy({ "src/js": "js" });

    // CSS
    eleventyConfig.addPassthroughCopy("src/css");
    eleventyConfig.addWatchTarget("src/css");

    // CSS Processing
    eleventyConfig.on("eleventy.before", async () => {
        await bundleCss();
    });

    // Read file filter
    eleventyConfig.addFilter("readFile", function (filepath) {
        return fs.readFileSync(filepath, "utf8");
    });

    return {
        dir: {
            input: "src",
            data: "_data",
            output: "public",
            includes: "_includes",
            layouts: "_includes"
        }
    };
};
