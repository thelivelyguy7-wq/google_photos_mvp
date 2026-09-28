const { image_search } = require('duckduckgo-images-api');
async function test() {
    try {
        const results = await image_search({ query: "Goa beach", moderate: true });
        console.log(results.slice(0, 5));
    } catch (e) {
        console.error(e);
    }
}
test();
