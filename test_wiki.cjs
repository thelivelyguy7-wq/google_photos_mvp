async function testWiki() {
    const query = "goa beach";
    const res = await fetch(`https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url&format=json`);
    const data = await res.json();
    const urls = Object.values(data.query.pages).map(p => p.imageinfo[0].url);
    console.log(urls);
}
testWiki();
