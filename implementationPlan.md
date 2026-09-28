# IMPLEMENTATION PLAN — GOOGLE PHOTOS AI-NATIVE RETRIEVAL MVP

This implementation plan bridges the product vision from `problemstatement.md` and the technical design from `architecture.md`. It outlines the step-by-step process to build the MVP for V1 usability testing.

---

## Phase 0: Precondition & Infrastructure Setup
*Goal: Establish the base repository, mock dataset, and underlying indexes before building the retrieval loop.*

1. **Scaffold the Frontend MVP:**
   - Initialize Vite/React web app.
   - Establish base CSS (glassmorphism UI, modern typography).
   - Set up routing and basic component structure.
2. **Build Mock Dataset:**
   - Organize a local dataset of 72 attached test photos mimicking 6 diverse retrieval scenarios (e.g., blurry concerts, beach sunsets, hidden waterfalls, houseboat trips).
   - Manually assign JSON metadata (Exif, Location, People, Time) and descriptive semantic tags to these photos.
3. **Initialize Mock Databases:**
   - Setup an in-memory Metadata Index array.
   - Generate simple dummy vector embeddings (or use a lightweight library for text-to-text semantic matching if a real Vector DB is out of scope for rapid V1 testing).

---

## Phase 1: Implement "Express" (Context Extraction)
*Goal: Allow the user to input unstructured memory and convert it into structured technical signals.*

1. **Build the Natural Language Input UI:**
   - Create the prominent search bar with prompt examples ("Describe the photo you're looking for...").
   - Add micro-animations (e.g., "Interpreting contextual memory...") to map to the `Express` transition.
2. **Develop the Context Interpretation Engine (LLM):**
   - Integrate an LLM API (e.g., OpenAI, Gemini) or simulate it via a mock service layer for deterministic testing.
   - Write strict prompts instructing the LLM to parse natural text into a JSON object with:
     - `Hard Filters`: `[People, Location, Date/Time]`
     - `Semantic Vibe`: `String description`
3. **Session State Initialization:**
   - Build a React Context provider (Session State Manager) to hold the `sessionId`, `rawQuery`, and `extractedContext`.

---

## Phase 2: Implement "Discover" (Contextual Candidate Retrieval)
*Goal: Combine the structured clues to find plausible candidate photos.*

1. **Develop Hybrid Retrieval Logic (Backend/Mock Backend):**
   - **Vector Search Mock:** Create a function that scores images based on similarity between the LLM's `Semantic Vibe` and the image's pre-defined semantic tags.
   - **Metadata Filtering:** Write intersection logic to strictly filter out images that do not match the LLM's `Hard Filters` (e.g., dropping photos not in "Goa").
2. **Ranking & Scoring:**
   - Create a weighting algorithm that combines the semantic score and metadata match confidence to return the Top K images.
3. **Integration:**
   - Connect the UI's `Express` state transition to trigger the `Discover` service and wait for the payload.

---

## Phase 3: Implement "Narrow" (Human-in-the-Loop)
*Goal: Present results and dynamic filters so the user can visually identify the target.*

1. **Build the Candidate Grid UI:**
   - Render the returned Top K images in a visually appealing grid.
   - Implement hover states, confidence score overlays, and a visual selection mechanism.
2. **Develop Dynamic Contextual Filters:**
   - Write a utility function that analyzes the returned Candidate Set's metadata distribution.
   - If the set contains photos spanning multiple years, generate a "Date" filter. If multiple locations, generate a "Location" filter.
   - Render these dynamically as interactive chips in the UI.
3. **Capture User Actions:**
   - Track which filters the user clicks and whether they select a target photo or click "None of these".
   - Update the Session State Manager with these interactions.

---

## Phase 4: Implement "Recover" (Guided State Pivot)
*Goal: Prevent dead-ends by suggesting logical next steps based on the failed context.*

1. **Build Recovery Analysis Logic:**
   - When "None of these" is triggered, read the current Session State.
   - Identify weak or over-constrained filters (e.g., "We only found 2 photos for 'Goa', maybe it was somewhere else?").
2. **Generate Recovery Suggestions:**
   - Create a rule-based engine (or LLM call) to output 2-3 logical pivots:
     - *Broaden:* "Remove Location filter"
     - *Narrow:* "Add a specific person"
     - *Shift:* "Try photos from a different timeframe"
3. **Build Guided Recovery UI:**
   - Replace the search grid with the Recovery prompt screen.
   - Clicking a suggestion updates the Session State and automatically triggers **Phase 2: Discover** again, creating the adaptive loop.

---

## Phase 5: V1 Usability Testing & Diagnostics
*Goal: Validate the Root-Cause Hypothesis against the SEG-T profile.*

1. **Prepare Test Scenarios:**
   - Draft 3 specific contextual scenarios for the users (e.g., "Find the sunset beach photo" or "Find the Kerala houseboat photo"). Ensure the mock dataset contains these targets but withhold exact identifiers.
2. **Conduct the Tests:**
   - Observe the users moving through the journey: `Remember → Express → Discover → Narrow → Recover`.
3. **Measure Behavioral Metrics (Analytics Implementation):**
   - Build lightweight logging to track:
     - *Retrieval success* (Did they select the correct photo?)
     - *Time to retrieval* (Timestamp delta).
     - *Strategy switches* (How many Recovery loops occurred?).
4. **Compile Learnings for V2:**
   - Populate the V1 → V2 matrix defined in the problem statement based on actual user friction observed during testing.
