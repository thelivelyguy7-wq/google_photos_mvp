const google = require('googlethis');
async function test() {
    const images = await google.image('Goa beach cafe sunset', { safe: false });
    console.log(images.slice(0, 5));
}
test();
