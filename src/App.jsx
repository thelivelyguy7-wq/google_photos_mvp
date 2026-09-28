import React, { useState, useRef, useEffect } from 'react';
import { Search, ArrowRight, Sparkles, MapPin, Clock, Users, Camera, X } from 'lucide-react';
import { MOCK_DATABASE, mockSemanticSearch, filterByMetadata } from './mockData';

// --- PHASE 1: EXPRESS (Context Extraction Mock) ---
const mockContextExtractor = (query) => {
  const q = query.toLowerCase();
  const context = {
    hardFilters: {},
    semanticVibe: query,
    displayClues: []
  };

  // Locations
  if (q.includes('goa')) {
    context.hardFilters.location = 'Goa';
    context.displayClues.push({ type: 'location', value: 'Goa', icon: <MapPin size={16} /> });
  } else if (q.includes('maharashtra')) {
    context.hardFilters.location = 'Maharashtra';
    context.displayClues.push({ type: 'location', value: 'Maharashtra', icon: <MapPin size={16} /> });
  } else if (q.includes('kerala')) {
    context.hardFilters.location = 'Kerala';
    context.displayClues.push({ type: 'location', value: 'Kerala', icon: <MapPin size={16} /> });
  }

  // People
  if (q.includes('cousin')) {
    context.hardFilters.people = 'Cousin';
    context.displayClues.push({ type: 'people', value: 'Cousin', icon: <Users size={16} /> });
  } else if (q.includes('family')) {
    context.hardFilters.people = 'Family';
    context.displayClues.push({ type: 'people', value: 'Family', icon: <Users size={16} /> });
  } else if (q.includes('friends') || q.includes('group')) {
    context.hardFilters.people = 'Friends';
    context.displayClues.push({ type: 'people', value: 'Friends', icon: <Users size={16} /> });
  }

  // Time
  if (q.includes('sunset')) {
    context.hardFilters.time = 'Sunset';
    context.displayClues.push({ type: 'time', value: 'Sunset', icon: <Clock size={16} /> });
  } else if (q.includes('night') || q.includes('late') || q.includes('dinner')) {
    context.hardFilters.time = 'Night';
    context.displayClues.push({ type: 'time', value: 'Night', icon: <Clock size={16} /> });
  } else if (q.includes('morning') || q.includes('breakfast')) {
    context.hardFilters.time = 'Morning';
    context.displayClues.push({ type: 'time', value: 'Morning', icon: <Clock size={16} /> });
  } else if (q.includes('afternoon')) {
    context.hardFilters.time = 'Afternoon';
    context.displayClues.push({ type: 'time', value: 'Afternoon', icon: <Clock size={16} /> });
  }

  // Generic Environment clues for display
  if (q.includes('beach') || q.includes('ocean') || q.includes('sand')) {
    context.displayClues.push({ type: 'environment', value: 'Beach/Ocean', icon: <Camera size={16} /> });
  }
  if (q.includes('mountain') || q.includes('hiking') || q.includes('cliff')) {
    context.displayClues.push({ type: 'environment', value: 'Outdoors/Cliffs', icon: <Camera size={16} /> });
  }
  if (q.includes('party') || q.includes('concert')) {
    context.displayClues.push({ type: 'environment', value: 'Party/Event', icon: <Camera size={16} /> });
  }
  if (q.includes('food') || q.includes('seafood') || q.includes('eating') || q.includes('cafe')) {
    context.displayClues.push({ type: 'environment', value: 'Food/Dining', icon: <Camera size={16} /> });
  }
  if (q.includes('scooter') || q.includes('riding') || q.includes('boat')) {
    context.displayClues.push({ type: 'environment', value: 'Vehicle/Travel', icon: <Camera size={16} /> });
  }

  return context;
};

export default function App() {
  const [stage, setStage] = useState('search'); 
  const [query, setQuery] = useState('');
  
  // Session State Manager (Core to the Adaptive Loop)
  const [sessionState, setSessionState] = useState({
    rawQuery: '',
    context: null,
    candidates: [],
    availableFilters: {}
  });
  
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const inputRef = useRef(null);

  const predefinedExamples = [
    "Beach café with my cousin around sunset in Goa",
    "Late night beach party with friends in Goa",
    "Hiking in the monsoon near Maharashtra mountains",
    "The houseboat trip we took in Kerala with family",
    "That hidden waterfall we found in the jungle",
    "Watching the sunset from a hammock"
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setStage('interpreting');
    
    // PHASE 1 Execution
    setTimeout(() => {
      const extractedContext = mockContextExtractor(query);
      
      setSessionState(prev => ({
        ...prev,
        rawQuery: query,
        context: extractedContext
      }));
      
      // Move to Phase 2
      executeMatch(extractedContext);
    }, 1200);
  };

  // --- PHASE 2: DISCOVER (Contextual Candidate Retrieval) ---
  const executeMatch = (context) => {
    setTimeout(() => {
      // 1. Vector Search (Semantic)
      let results = mockSemanticSearch(context.semanticVibe);
      
      // 2. Hard Metadata Filter
      results = filterByMetadata(results, context.hardFilters);
      
      // 3. Sort by similarity and filter out 0 match scores for better fidelity
      results = results.filter(r => r.similarity > 0);
      results.sort((a, b) => b.similarity - a.similarity);
      
      // --- PHASE 3 Setup: Dynamic Contextual Filters (Pre-Narrow) ---
      const locations = [...new Set(results.map(r => r.metadata.location))];
      const years = [...new Set(results.map(r => r.metadata.year))];
      
      const groupedByIdentifier = {};
      results.forEach(r => {
        if (!groupedByIdentifier[r.metadata.identifier]) groupedByIdentifier[r.metadata.identifier] = [];
        groupedByIdentifier[r.metadata.identifier].push(r);
      });
      const topIdentifier = Object.keys(groupedByIdentifier)[0];
      const displayedCandidates = topIdentifier ? groupedByIdentifier[topIdentifier] : [];

      setSessionState(prev => ({
        ...prev,
        allCandidates: results,
        displayedIdentifier: topIdentifier,
        candidates: displayedCandidates.slice(0, 6),
        availableFilters: { locations, years }
      }));
      
      setStage('results');
    }, 1000);
  };

  // --- PHASE 5: RECOVER (Guided State Pivot) ---
  const handleRecoveryPivot = (pivotType, value) => {
    setStage('interpreting'); // Show loading state
    
    setTimeout(() => {
      let newContext = { ...sessionState.context };
      
      if (pivotType === 'drop_location') {
        delete newContext.hardFilters.location;
        newContext.displayClues = newContext.displayClues.filter(c => c.type !== 'location');
      } else if (pivotType === 'change_location') {
        newContext.hardFilters.location = value;
        newContext.displayClues = newContext.displayClues.filter(c => c.type !== 'location');
        newContext.displayClues.push({ type: 'location', value: value, icon: <MapPin size={16} /> });
      } else if (pivotType === 'drop_time') {
        delete newContext.hardFilters.time;
        newContext.displayClues = newContext.displayClues.filter(c => c.type !== 'time');
      } else if (pivotType === 'drop_people') {
        delete newContext.hardFilters.people;
        newContext.displayClues = newContext.displayClues.filter(c => c.type !== 'people');
      }
      
      setSessionState(prev => ({ ...prev, context: newContext }));
      
      // Trigger Match loop again with updated Session State
      executeMatch(newContext);
    }, 1000);
  };

  const selectExample = (ex) => {
    setQuery(ex);
    inputRef.current?.focus();
  };

  return (
    <div className="app-container">
      {/* Top Bar for Context */}
      {stage !== 'search' && (
        <div className="glass animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Sparkles size={20} color="var(--accent)" />
            <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Google Photos</h2>
          </div>
          <button className="btn-secondary btn" onClick={() => { setStage('search'); setQuery(''); setSessionState({ rawQuery: '', context: null, candidates: [], availableFilters: {} }); setSelectedPhoto(null); }}>
            New Search
          </button>
        </div>
      )}

      {stage === 'search' && (
        <div className="search-container animate-fade-in">
          <h1>Google Photos</h1>
          <p>Describe the photo you're looking for. Don't worry about exact dates.</p>
          
          <form className="search-input-wrapper" onSubmit={handleSearch}>
            <Search className="search-icon" size={24} />
            <input 
              ref={inputRef}
              type="text" 
              className="search-input"
              placeholder="e.g. The photo from our Goa trip at a beach café..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="submit-btn" disabled={!query.trim()}>
              <ArrowRight size={18} />
            </button>
          </form>

          <div style={{ marginTop: '3rem', width: '100%', maxWidth: '700px' }}>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Your Memories !</h3>
            <div className="chips-container" style={{ margin: 0 }}>
              {predefinedExamples.map((ex, i) => (
                <div key={i} className="chip" onClick={() => selectExample(ex)}>
                  {ex}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {stage === 'interpreting' && (
        <div className="search-container animate-fade-in">
          <Sparkles size={48} color="var(--accent)" style={{ animation: 'pulse-glow 2s infinite', borderRadius: '50%', marginBottom: '2rem' }} />
          <h2>Interpreting Contextual Memory...</h2>
          
          {sessionState.context ? (
             null
          ) : (
            <div className="interpreting-container">
              <p>Extracting unstructured clues from: <i>"{query}"</i></p>
            </div>
          )}
        </div>
      )}

      {/* --- PHASE 4: NARROW (Human-in-the-loop candidate inspection) --- */}
      {(stage === 'results' || stage === 'recovery' || stage === 'success') && (
        <div className="animate-fade-in">
          <div className="results-header">
            <div>
              <h2>Here's what we found</h2>
              <p>Matched against your contextual clues. Found {sessionState.candidates.length} candidate(s).</p>
            </div>
          </div>

          {sessionState.candidates.length > 0 ? (
            <div className="photo-grid">
              {sessionState.candidates.map((photo) => (
                <div 
                  key={photo.id} 
                  className={`photo-card ${selectedPhoto === photo.id ? 'selected' : ''}`}
                  onClick={() => setSelectedPhoto(photo.id)}
                >
                  <img src={encodeURI(photo.url)} alt={`Match ${photo.id}`} className="photo-img" />
                  <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', backdropFilter: 'blur(4px)' }}>
                    {photo.similarity}% Semantic Match
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--surface)', borderRadius: '16px' }}>
               <h3 style={{ marginBottom: '1rem' }}>No perfect matches found</h3>
               <p style={{ color: 'var(--text-secondary)' }}>Your memory clues might be too restrictive.</p>
            </div>
          )}

          {stage === 'results' && sessionState.candidates.length > 0 && (
            <div className="recovery-container glass" style={{ marginTop: '3rem', padding: '2rem', textAlign: 'center' }}>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Did you find it?</h3>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button 
                  className="btn btn-primary"
                  onClick={() => setStage('success')}
                  disabled={!selectedPhoto}
                >
                  Yes, this is it!
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => setStage('recovery')}
                >
                  No, none of these
                </button>
              </div>
            </div>
          )}

          {/* --- PHASE 5: RECOVER (Guided Pivot UI) --- */}
          {stage === 'recovery' && (
            <div className="recovery-container glass animate-fade-in" style={{ marginTop: '3rem', padding: '2rem', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', color: '#ffb3b3' }}>Not to worry,</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                   <button 
                     className="btn" 
                     style={{ background: 'transparent', padding: '0.5rem', color: sessionState.expandedCategory ? '#fcd34d' : 'rgba(255,255,255,0.2)', cursor: sessionState.expandedCategory ? 'pointer' : 'not-allowed' }} 
                     onClick={() => {
                        if (sessionState.expandedCategory) {
                           setSessionState(prev => ({ ...prev, expandedCategory: null, activeSignal: null }));
                        }
                     }}
                     disabled={!sessionState.expandedCategory}
                   >
                     <ArrowRight size={24} style={{ transform: 'rotate(180deg)' }} />
                   </button>
                   <button 
                     className="btn" 
                     style={{ background: 'transparent', padding: '0.5rem', color: '#fcd34d' }} 
                     onClick={() => setStage('results')}
                   >
                     <ArrowRight size={24} />
                   </button>
                </div>
              </div>
              <p style={{ marginBottom: '1.5rem', color: '#fcd34d', fontWeight: 500, fontSize: '1.05rem' }}>Let's find the exact match, Give me a hint !</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                {(() => {
                  const TAXONOMIES = {
                    "Beach café with my cousin around sunset in Goa": {
                      "Location / environment": { icon: <MapPin size={20} color="var(--text-secondary)" />, signals: ['Beach', 'Ocean', 'Tropical', 'Beachside'] },
                      "Time / lighting": { icon: <Clock size={20} color="var(--text-secondary)" />, signals: ['Sunset', 'Golden hour', 'Pink/orange sky', 'Twilight'] },
                      "People": { icon: <Users size={20} color="var(--text-secondary)" />, signals: ['Woman', 'Man', 'Couple'] },
                      "Place / setting": { icon: <MapPin size={20} color="var(--text-secondary)" />, signals: ['Beach café/shack', 'Outdoor seating', 'Palm trees', 'Wooden deck'] },
                      "Activity / objects": { icon: <Sparkles size={20} color="var(--text-secondary)" />, signals: ['Drinks', 'Food', 'Tables', 'Dining', 'Candles/lanterns'] },
                      "Specific visual cues": { icon: <Camera size={20} color="var(--text-secondary)" />, signals: ['Hammock', 'smartphone', 'coconut drink', 'jewelry', 'placemats', 'string lights'] }
                    },
                    "Late night beach party with friends in Goa": {
                      "Location / Environment": { icon: <MapPin size={20} color="var(--text-secondary)" />, signals: ['Goa', 'beach', 'ocean', 'seashore', 'beachside', 'beach shack', 'sand', 'tropical', 'palm trees'] },
                      "People": { icon: <Users size={20} color="var(--text-secondary)" />, signals: ['Man', 'woman', 'couple', 'friends', 'group', 'crowd', 'young adults'] },
                      "Activity": { icon: <Sparkles size={20} color="var(--text-secondary)" />, signals: ['Party', 'dancing', 'eating', 'drinking', 'socializing', 'beach walk', 'campfire', 'singing'] },
                      "Food / Drinks": { icon: <Sparkles size={20} color="var(--text-secondary)" />, signals: ['Food', 'barbecue', 'grilled food', 'seafood', 'fish fry', 'skewers', 'cocktails', 'bottles', 'coconut drinks'] },
                      "Night / Lighting": { icon: <Clock size={20} color="var(--text-secondary)" />, signals: ['Night', 'evening', 'moonlight', 'starry sky', 'firelight', 'candlelight', 'lanterns', 'string lights', 'neon lights'] },
                      "Entertainment": { icon: <Sparkles size={20} color="var(--text-secondary)" />, signals: ['Guitar', 'live music', 'singing', 'dancing', 'fire performance', 'fire dancing'] },
                      "Objects / Props": { icon: <Camera size={20} color="var(--text-secondary)" />, signals: ['Guitar', 'campfire', 'fire props', 'lantern', 'candles', 'grill', 'skewers', 'plates', 'bottles', 'neon sign'] },
                      "Clothing": { icon: <Sparkles size={20} color="var(--text-secondary)" />, signals: ['Beachwear', 'shorts', 'T-shirts', 'casual/summer clothing'] }
                    },
                    "Hiking in the monsoon near Maharashtra mountains": {
                      "Location / Environment": { icon: <MapPin size={20} color="var(--text-secondary)" />, signals: ['Mountain', 'forest', 'rainforest', 'waterfall', 'valley', 'river', 'stream', 'cave', 'gorge', 'cliff', 'tropical landscape'] },
                      "People": { icon: <Users size={20} color="var(--text-secondary)" />, signals: ['Hiker', 'trekker', 'group', 'couple', 'man', 'woman', 'friends', 'backpacker'] },
                      "Activity": { icon: <Sparkles size={20} color="var(--text-secondary)" />, signals: ['Trekking', 'hiking', 'climbing', 'walking', 'stream crossing', 'exploring', 'sightseeing', 'photography'] },
                      "Terrain": { icon: <MapPin size={20} color="var(--text-secondary)" />, signals: ['Rocky trail', 'steep slope', 'rock steps', 'muddy path', 'wet rocks', 'stone path', 'ridge', 'cave', 'tree roots'] },
                      "Weather": { icon: <Clock size={20} color="var(--text-secondary)" />, signals: ['Rain', 'mist', 'fog', 'cloudy', 'overcast', 'wet', 'monsoon'] },
                      "Objects / Gear": { icon: <Camera size={20} color="var(--text-secondary)" />, signals: ['Backpack', 'rain jacket', 'raincoat', 'hiking boots', 'umbrella', 'chain', 'rope', 'water bottle', 'thermos'] }
                    },
                    "The houseboat trip we took in Kerala with family": {
                      "Location / Environment": { icon: <MapPin size={20} color="var(--text-secondary)" />, signals: ['Kerala', 'backwaters', 'river', 'lake', 'canal', 'village', 'tropical landscape'] },
                      "People": { icon: <Users size={20} color="var(--text-secondary)" />, signals: ['Family', 'children', 'elderly', 'man', 'woman', 'couple', 'group', 'locals'] },
                      "Activity": { icon: <Sparkles size={20} color="var(--text-secondary)" />, signals: ['Houseboat trip', 'boat ride', 'sightseeing', 'eating', 'dining', 'relaxing', 'talking', 'reading'] },
                      "Houseboat / Boat": { icon: <MapPin size={20} color="var(--text-secondary)" />, signals: ['Houseboat', 'boat deck', 'cabin', 'railing', 'steering wheel', 'boat window', 'fishing boat'] },
                      "Food / Dining": { icon: <Sparkles size={20} color="var(--text-secondary)" />, signals: ['Family meal', 'rice', 'curry', 'banana leaf', 'tea', 'coffee', 'dinner', 'dining table'] },
                      "Nature / Landscape": { icon: <MapPin size={20} color="var(--text-secondary)" />, signals: ['Coconut palms', 'greenery', 'water', 'islands', 'village', 'sunset', 'reflection'] },
                      "Culture": { icon: <Sparkles size={20} color="var(--text-secondary)" />, signals: ['Traditional clothing', 'fishing', 'Chinese fishing net', 'dance', 'ceremony', 'oil lamps'] },
                      "Time / Lighting": { icon: <Clock size={20} color="var(--text-secondary)" />, signals: ['Day', 'sunset', 'evening', 'twilight', 'night', 'moonlight', 'starry sky', 'lantern light'] },
                      "Objects / Props": { icon: <Camera size={20} color="var(--text-secondary)" />, signals: ['Newspaper', 'cups', 'plates', 'steering wheel', 'fishing net', 'lanterns', 'candles', 'lamps'] }
                    },
                    "That hidden waterfall we found in the jungle": {
                      "Location / Environment": { icon: <MapPin size={20} color="var(--text-secondary)" />, signals: ['Waterfall', 'forest', 'rainforest', 'jungle', 'mountain', 'valley', 'gorge', 'cave', 'river', 'stream'] },
                      "People": { icon: <Users size={20} color="var(--text-secondary)" />, signals: ['Hiker', 'trekker', 'backpacker', 'man', 'woman', 'couple', 'group', 'solo person'] },
                      "Activity": { icon: <Sparkles size={20} color="var(--text-secondary)" />, signals: ['Trekking', 'hiking', 'climbing', 'exploring', 'sightseeing', 'picnic', 'relaxing', 'photography'] },
                      "Waterfall / Water": { icon: <MapPin size={20} color="var(--text-secondary)" />, signals: ['Large waterfall', 'cascading waterfall', 'waterfall pool', 'stream', 'rapids', 'mist', 'water spray'] },
                      "Terrain": { icon: <MapPin size={20} color="var(--text-secondary)" />, signals: ['Rocks', 'cave', 'rock ledge', 'rock steps', 'tree roots', 'cliff', 'steep trail', 'hammock'] },
                      "Vegetation": { icon: <Sparkles size={20} color="var(--text-secondary)" />, signals: ['Ferns', 'moss', 'vines', 'flowers', 'large leaves', 'dense greenery', 'tropical plants'] },
                      "Weather / Lighting": { icon: <Clock size={20} color="var(--text-secondary)" />, signals: ['Rain', 'mist', 'fog', 'cloudy', 'wet', 'monsoon', 'daylight', 'sunset', 'twilight', 'night'] },
                      "Food / Leisure": { icon: <Sparkles size={20} color="var(--text-secondary)" />, signals: ['Picnic', 'food', 'tea', 'coffee', 'thermos', 'drinks', 'banana leaf', 'hammock'] },
                      "Objects / Gear": { icon: <Camera size={20} color="var(--text-secondary)" />, signals: ['Backpack', 'boots', 'raincoat', 'umbrella', 'thermos', 'hammock', 'rope', 'lantern'] },
                      "Culture / Social": { icon: <Sparkles size={20} color="var(--text-secondary)" />, signals: ['Dance', 'performance', 'traditional clothing', 'audience', 'ceremony', 'torches'] }
                    },
                    "Watching the sunset from a hammock": {
                      "Location / Environment": { icon: <MapPin size={20} color="var(--text-secondary)" />, signals: ['Beach', 'ocean', 'mountain', 'valley', 'backwaters', 'waterfall', 'forest', 'river', 'lake'] },
                      "People / Relationship": { icon: <Users size={20} color="var(--text-secondary)" />, signals: ['Family', 'parents', 'children', 'couple', 'friends', 'cousin', 'elderly couple', 'group', 'solo person'] },
                      "Activity": { icon: <Sparkles size={20} color="var(--text-secondary)" />, signals: ['Relaxing', 'talking', 'socializing', 'traveling', 'sightseeing', 'drinking', 'eating', 'watching sunset'] },
                      "Time / Lighting": { icon: <Clock size={20} color="var(--text-secondary)" />, signals: ['Sunset', 'golden hour', 'evening', 'twilight', 'night', 'moonlight', 'pink/orange sky'] },
                      "Hammock / Relaxation": { icon: <MapPin size={20} color="var(--text-secondary)" />, signals: ['Hammock', 'hammock by beach', 'hammock by mountain', 'hammock by waterfall', 'hammock by backwaters'] },
                      "Food / Drinks": { icon: <Sparkles size={20} color="var(--text-secondary)" />, signals: ['Drinks', 'cocktail', 'coconut drink', 'food', 'snacks', 'dinner', 'shared meal'] },
                      "Architecture / Setting": { icon: <MapPin size={20} color="var(--text-secondary)" />, signals: ['Beach hut', 'shack', 'thatched roof', 'wooden cabin', 'houseboat', 'deck', 'outdoor seating'] },
                      "Nature / Scenery": { icon: <MapPin size={20} color="var(--text-secondary)" />, signals: ['Palm trees', 'mountains', 'waves', 'clouds', 'mist', 'waterfall', 'greenery', 'lake', 'river'] },
                      "Objects / Props": { icon: <Camera size={20} color="var(--text-secondary)" />, signals: ['Hammock', 'table', 'chairs', 'phone', 'glass', 'bottle', 'boat', 'lantern', 'candles', 'string lights'] }
                    }
                  };
                  
                  const vibe = (sessionState.context?.semanticVibe || '').toLowerCase();
                  const activePrompt = Object.keys(TAXONOMIES).find(k => k.toLowerCase() === vibe) 
                    || Object.keys(TAXONOMIES).find(k => vibe && k.toLowerCase().includes(vibe))
                    || Object.keys(TAXONOMIES)[0];
                  const TAXONOMY = TAXONOMIES[activePrompt];
                  
                  if (!sessionState.expandedCategory) {
                    return Object.entries(TAXONOMY).map(([category, data]) => (
                      <div 
                        key={category} 
                        className="glass" 
                        style={{ padding: '1rem 1.25rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}
                        onClick={() => setSessionState(prev => ({ ...prev, expandedCategory: category }))}
                      >
                        {data.icon}
                        <div style={{ flex: 1, fontSize: '1rem', fontWeight: 500 }}>{category}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginRight: '1rem' }}>{data.signals.length} filters</div>
                        <ArrowRight size={18} color="var(--text-secondary)" />
                      </div>
                    ));
                  } else {
                    const data = TAXONOMY[sessionState.expandedCategory];
                    return (
                      <div className="animate-fade-in">
                        
                        
                        <h4 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', color: '#fff' }}>{sessionState.expandedCategory}</h4>
                        <div className="chips-container" style={{ margin: 0, justifyContent: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                          {data.signals.map(sig => {
                             const cleanSig = sig.replace(/\s\d+$/, '');
                             const isActive = sessionState.activeSignal === cleanSig;
                             return (
                               <span 
                                 key={sig} 
                                 className="chip" 
                                 onClick={() => setSessionState(prev => ({ ...prev, activeSignal: isActive ? null : cleanSig }))}
                                 style={{ 
                                   fontSize: '0.8rem', 
                                   padding: '0.3rem 0.6rem', 
                                   cursor: 'pointer',
                                   background: isActive ? 'var(--accent)' : 'rgba(255,255,255,0.1)',
                                   color: isActive ? '#000' : 'var(--text-primary)',
                                   border: isActive ? 'none' : '1px solid rgba(255,255,255,0.2)'
                                 }}
                               >
                                 {sig}
                               </span>
                             )
                          })}
                        </div>
                        
                        
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.5rem' }}>
                          {(() => {
                             let baseImgs = MOCK_DATABASE.filter(img => img.metadata.identifier === activePrompt);
                             let imgs = baseImgs;
                             if (sessionState.activeSignal) {
                                const active = sessionState.activeSignal.toLowerCase();
                                imgs = baseImgs.filter(img => {
                                   if (!img.semanticTags) return false;
                                   return img.semanticTags.some(tag => tag.toLowerCase().includes(active) || active.includes(tag.toLowerCase()));
                                });
                                
                                if (imgs.length === 0) {
                                   imgs = baseImgs.slice(0, 3);
                                }
                             }
                             
                             imgs = imgs.slice(0, 12);
                             
                             return imgs.map(img => (
                                <img 
                                  key={img.id} 
                                  src={encodeURI(img.url)} 
                                  alt="preview" 
                              onClick={() => {
                                setSelectedPhoto(img.id);
                                setStage('success');
                              }} 
                              style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '4px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)' }} 
                            />
                          ));
                          })()}
                        </div>
                      </div>
                    );
                  }
                })()}
              </div>
            </div>
          )}
          
          {/* --- USABILITY SUCCESS LOGGING --- */}
          {stage === 'success' && (
            <div className="recovery-container glass animate-fade-in" style={{ marginTop: '3rem', padding: '2rem', textAlign: 'center', borderColor: 'var(--accent)' }}>
              {selectedPhoto && (() => {
                const photo = MOCK_DATABASE.find(img => img.id === selectedPhoto);
                if (photo) {
                  return (
                    <img 
                      src={encodeURI(photo.url)} 
                      alt="Selected" 
                      style={{ width: '100%', maxWidth: '300px', height: 'auto', objectFit: 'cover', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.2)' }} 
                    />
                  );
                }
                return null;
              })()}
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#e0d9ff' }}>Retrieval Successful!</h3>
              <p>You retrieved photo #{selectedPhoto} effortlessly.</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>
                <em>[Diagnostics Logged: Time to retrieval, candidate inspections, recovery pivots]</em>
              </p>
              <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => { setStage('search'); setQuery(''); setSessionState({ rawQuery: '', context: null, candidates: [], availableFilters: {} }); setSelectedPhoto(null); }}>
                Start Another Retrieval
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
