const fs = require('fs');
const path = require('path');

const googleDir = path.join(__dirname, 'public', 'google');
const folders = fs.readdirSync(googleDir).filter(f => fs.statSync(path.join(googleDir, f)).isDirectory());

const promptMetadataMap = {
  "Beach café with my cousin around sunset in Goa": {
    baseTags: ['beach', 'cafe', 'sunset', 'ocean', 'relaxed'],
    metadata: { location: 'Goa', time: 'Sunset', people: ['Cousin'], year: 2022 },
    extraSignals: ['Beach', 'Ocean', 'Tropical', 'Beachside', 'Sunset', 'Golden hour', 'Pink/orange sky', 'Twilight', 'Woman', 'Man', 'Couple', 'Beach café/shack', 'Outdoor seating', 'Palm trees', 'Wooden deck', 'Drinks', 'Food', 'Tables', 'Dining', 'Candles/lanterns', 'Hammock', 'smartphone', 'coconut drink', 'jewelry', 'placemats', 'string lights']
  },
  "Late night beach party with friends in Goa": {
    baseTags: ['party', 'night', 'beach', 'friends', 'blurry', 'dancing', 'late'],
    metadata: { location: 'Goa', time: 'Night', people: ['Friends'], year: 2023 },
    extraSignals: ['Goa', 'beach', 'ocean', 'seashore', 'beachside', 'beach shack', 'sand', 'tropical', 'palm trees', 'Man', 'woman', 'couple', 'friends', 'group', 'crowd', 'young adults', 'Party', 'dancing', 'eating', 'drinking', 'socializing', 'beach walk', 'campfire', 'singing', 'Food', 'barbecue', 'grilled food', 'seafood', 'fish fry', 'skewers', 'cocktails', 'bottles', 'coconut drinks', 'Night', 'evening', 'moonlight', 'starry sky', 'firelight', 'candlelight', 'lanterns', 'string lights', 'neon lights', 'Guitar', 'live music', 'fire performance', 'fire dancing', 'grill', 'plates', 'neon sign', 'Beachwear', 'shorts', 'T-shirts', 'casual/summer clothing']
  },
  "Hiking in the monsoon near Maharashtra mountains": {
    baseTags: ['hiking', 'monsoon', 'rain', 'mountains', 'trekking', 'green'],
    metadata: { location: 'Maharashtra', time: 'Morning', people: ['Friends'], year: 2021 },
    extraSignals: ['Mountain', 'forest', 'rainforest', 'waterfall', 'valley', 'river', 'stream', 'cave', 'gorge', 'cliff', 'tropical landscape', 'Hiker', 'trekker', 'group', 'couple', 'man', 'woman', 'friends', 'backpacker', 'Trekking', 'hiking', 'climbing', 'walking', 'stream crossing', 'exploring', 'sightseeing', 'photography', 'Rocky trail', 'steep slope', 'rock steps', 'muddy path', 'wet rocks', 'stone path', 'ridge', 'tree roots', 'Rain', 'mist', 'fog', 'cloudy', 'overcast', 'wet', 'monsoon', 'Backpack', 'rain jacket', 'raincoat', 'hiking boots', 'umbrella', 'chain', 'rope', 'water bottle', 'thermos']
  },
  "The houseboat trip we took in Kerala with family": {
    baseTags: ['houseboat', 'kerala', 'water', 'backwaters', 'trees', 'boat'],
    metadata: { location: 'Kerala', time: 'Afternoon', people: ['Family'], year: 2023 },
    extraSignals: ['Kerala', 'backwaters', 'river', 'lake', 'canal', 'village', 'tropical landscape', 'Family', 'children', 'elderly', 'man', 'woman', 'couple', 'group', 'locals', 'Houseboat trip', 'boat ride', 'sightseeing', 'eating', 'dining', 'relaxing', 'talking', 'reading', 'Houseboat', 'boat deck', 'cabin', 'railing', 'steering wheel', 'boat window', 'fishing boat', 'Family meal', 'rice', 'curry', 'banana leaf', 'tea', 'coffee', 'dinner', 'dining table', 'Coconut palms', 'greenery', 'water', 'islands', 'sunset', 'reflection', 'Traditional clothing', 'fishing', 'Chinese fishing net', 'dance', 'ceremony', 'oil lamps', 'Day', 'evening', 'twilight', 'night', 'moonlight', 'starry sky', 'lantern light', 'Newspaper', 'cups', 'plates', 'fishing net', 'lanterns', 'candles', 'lamps']
  },
  "That hidden waterfall we found in the jungle": {
    baseTags: ['hidden', 'waterfall', 'jungle', 'nature', 'water', 'swimming'],
    metadata: { location: 'Kerala', time: 'Afternoon', people: ['Family'], year: 2023 },
    extraSignals: ['Waterfall', 'forest', 'rainforest', 'jungle', 'mountain', 'valley', 'gorge', 'cave', 'river', 'stream', 'Hiker', 'trekker', 'backpacker', 'man', 'woman', 'couple', 'group', 'solo person', 'Trekking', 'hiking', 'climbing', 'exploring', 'sightseeing', 'picnic', 'relaxing', 'photography', 'Large waterfall', 'cascading waterfall', 'waterfall pool', 'rapids', 'mist', 'water spray', 'Rocks', 'rock ledge', 'rock steps', 'tree roots', 'cliff', 'steep trail', 'hammock', 'Ferns', 'moss', 'vines', 'flowers', 'large leaves', 'dense greenery', 'tropical plants', 'Rain', 'fog', 'cloudy', 'wet', 'monsoon', 'daylight', 'sunset', 'twilight', 'night', 'Picnic', 'food', 'tea', 'coffee', 'thermos', 'drinks', 'banana leaf', 'Backpack', 'boots', 'raincoat', 'umbrella', 'rope', 'lantern', 'Dance', 'performance', 'traditional clothing', 'audience', 'ceremony', 'torches']
  },
  "Watching the sunset from a hammock": {
    baseTags: ['watching', 'sunset', 'hammock', 'relaxing', 'trees', 'beach'],
    metadata: { location: 'Goa', time: 'Sunset', people: ['Cousin'], year: 2022 },
    extraSignals: ['Beach', 'ocean', 'mountain', 'valley', 'backwaters', 'waterfall', 'forest', 'river', 'lake', 'Family', 'parents', 'children', 'couple', 'friends', 'cousin', 'elderly couple', 'group', 'solo person', 'Relaxing', 'talking', 'socializing', 'traveling', 'sightseeing', 'drinking', 'eating', 'watching sunset', 'Sunset', 'golden hour', 'evening', 'twilight', 'night', 'moonlight', 'pink/orange sky', 'Hammock', 'hammock by beach', 'hammock by mountain', 'hammock by waterfall', 'hammock by backwaters', 'Drinks', 'cocktail', 'coconut drink', 'food', 'snacks', 'dinner', 'shared meal', 'Beach hut', 'shack', 'thatched roof', 'wooden cabin', 'houseboat', 'deck', 'outdoor seating', 'Palm trees', 'mountains', 'waves', 'clouds', 'mist', 'greenery', 'table', 'chairs', 'phone', 'glass', 'bottle', 'boat', 'lantern', 'candles', 'string lights']
  }
};

let databaseEntries = [];
let idCounter = 100;

folders.forEach(folder => {
  const meta = promptMetadataMap[folder];
  if (!meta) return;

  const folderPath = path.join(googleDir, folder);
  const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg'));

  // Distribute all extra signals evenly among the files
  const allExtraSignals = meta.extraSignals ? [...meta.extraSignals] : [];
  
  files.forEach((file, index) => {
    // Extract prefix as identifier
    // Use the folder as the identifier so all images for this scenario are grouped together
    const identifier = folder;
    
    let signalsForThisImage = [];
    const isNewImage = file.includes('ai_gen') || file.includes('flickr_gen');

    if (isNewImage) {
        // Distribute extra signals only to the newly added rich images
        if (allExtraSignals.length > 0) {
           const countToAssign = Math.ceil((meta.extraSignals ? meta.extraSignals.length : 0) / 4);
           for(let i=0; i<countToAssign; i++) {
              if (allExtraSignals.length > 0) {
                 const randIdx = Math.floor(Math.random() * allExtraSignals.length);
                 signalsForThisImage.push(allExtraSignals.splice(randIdx, 1)[0].toLowerCase());
              }
           }
        } else {
           signalsForThisImage = meta.extraSignals ? [...meta.extraSignals].sort(() => 0.5 - Math.random()).slice(0, 5).map(s => s.toLowerCase()) : [];
        }
    } else {
        // Original placeholder images ONLY get a couple of basic baseTags, no extraSignals.
        signalsForThisImage = meta.baseTags ? [...meta.baseTags].sort(() => 0.5 - Math.random()).slice(0, 2).map(s => s.toLowerCase()) : [];
    }
    
    databaseEntries.push({
      id: idCounter++,
      url: `/google/${folder}/${file}`,
      metadata: { ...meta.metadata, identifier, originalFolder: folder },
      semanticTags: [...meta.baseTags, ...signalsForThisImage, `variation_${index}`]
    });
  });
});

const outputContent = `// src/mockData.js

export const MOCK_DATABASE = ${JSON.stringify(databaseEntries, null, 2)};

// Mock Vector/Semantic Matcher (Phase 0 Setup)
export const mockSemanticSearch = (semanticVibeString) => {
  const queryTokens = semanticVibeString.toLowerCase().split(' ').map(s => s.replace(/[^a-z0-9]/gi, '')); // basic sanitization
  
  return MOCK_DATABASE.map(img => {
    let score = 0;
    queryTokens.forEach(token => {
      if (token.length > 2 && img.semanticTags.some(tag => tag.includes(token) || token.includes(tag))) {
        score += 15; 
      }
    });
    // Add heavy bias for original folder match to ensure the exact prompt folder results bubble to top
    if (img.metadata.originalFolder && semanticVibeString.toLowerCase().includes(img.metadata.originalFolder.toLowerCase().split(' ')[0])) {
        score += 50; 
    }
    return { ...img, similarity: Math.min(score, 99) }; // Cap at 99%
  });
};

// Mock Metadata Filter (Phase 0 Setup)
export const filterByMetadata = (candidates, hardFilters) => {
  return candidates.filter(img => {
    let matches = true;
    if (hardFilters.location && img.metadata.location !== hardFilters.location) matches = false;
    if (hardFilters.people && !img.metadata.people.includes(hardFilters.people)) matches = false;
    if (hardFilters.year && img.metadata.year !== hardFilters.year) matches = false;
    if (hardFilters.time && img.metadata.time !== hardFilters.time) matches = false;
    return matches;
  });
};
`;

fs.writeFileSync(path.join(__dirname, 'src', 'mockData.js'), outputContent);
console.log('Successfully generated src/mockData.js with 12 extra images per prompt and missing signals.');
