import { Builder, Card, Deck } from './components/builder';
import { Refiner } from './components/refiner';
import { IOManager } from './components/io_manager';
import { Simulator } from './components/simulator';
import { Assistant } from './assistant/assistant';

interface SavedDeck {
    id: string;
    mission: string;
    coreCards: string;
    deck: Deck;
    timestamp: number;
}

// UI Elements
const generateBtn = document.getElementById('generate-btn') as HTMLButtonElement;
const saveBtn = document.getElementById('save-btn') as HTMLButtonElement;
const newDeckBtn = document.getElementById('new-deck-btn') as HTMLButtonElement;
const resultsArea = document.getElementById('results') as HTMLElement;
const winrateVal = document.getElementById('winrate-val') as HTMLElement;
const landsVal = document.getElementById('lands-val') as HTMLElement;
const assistantText = document.getElementById('assistant-text') as HTMLElement;
const decklistOutput = document.getElementById('decklist-output') as HTMLElement;
const missionInput = document.getElementById('mission') as HTMLInputElement;
const coreInput = document.getElementById('core-cards') as HTMLTextAreaElement;
const savedDecksList = document.getElementById('saved-decks-list') as HTMLElement;
const curveChart = document.getElementById('curve-chart') as HTMLElement;
const suggestionsList = document.getElementById('suggestions-list') as HTMLElement;

let currentDeck: Deck | null = null;
let currentDeckId: string | null = null;

// Initialization
loadSavedDecks();

generateBtn.addEventListener('click', () => {
    const mission = missionInput.value;
    const coreCardsStr = coreInput.value;
    const coreCards = coreCardsStr.split(',').map(c => c.trim()).filter(c => c !== "");

    if (coreCards.length === 0) {
        alert("Please enter some core cards!");
        return;
    }

    // Run Core logic
    let deck = Builder.buildRuleOf9(coreCards, mission);
    deck = Refiner.refineManaBase(deck);
    
    currentDeck = deck;
    updateResultsUI(deck);
});

saveBtn.addEventListener('click', () => {
    if (!currentDeck) return;
    
    const id = currentDeckId || Date.now().toString();
    const savedDeck: SavedDeck = {
        id,
        mission: missionInput.value,
        coreCards: coreInput.value,
        deck: currentDeck,
        timestamp: Date.now()
    };

    saveDeckToStorage(savedDeck);
    currentDeckId = id;
    loadSavedDecks();
    alert("Deck saved successfully!");
});

document.getElementById('new-deck-btn')?.addEventListener('click', () => {
    currentDeck = null;
    currentDeckId = null;
    missionInput.value = "";
    coreInput.value = "";
    resultsArea.classList.add('hidden');
});

function updateResultsUI(deck: Deck) {
    const winrate = Simulator.simulateMatchups(deck);
    const advice = Assistant.explainStrategy(deck);
    const mtgaList = IOManager.exportToMTGA(deck);

    // Update Stats
    winrateVal.innerText = `${winrate.toFixed(1)}%`;
    landsVal.innerText = deck.mainboard.filter(c => c.name === "Basic Land").reduce((s, c) => s + c.quantity, 0).toString();
    
    // Update Assistant
    assistantText.innerText = advice;
    
    // Update Curve
    renderCurve(deck);
    
    // Update Decklist
    decklistOutput.innerText = mtgaList;

    resultsArea.classList.remove('hidden');
    resultsArea.scrollIntoView({ behavior: 'smooth' });
}

function renderCurve(deck: Deck) {
    const counts: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    deck.mainboard.forEach(card => {
        if (card.manaValue !== undefined) {
            const cmc = Math.min(card.manaValue, 6);
            counts[cmc] += card.quantity;
        }
    });

    const max = Math.max(...Object.values(counts), 1);
    curveChart.innerHTML = Object.entries(counts).map(([cmc, qty]) => {
        const height = (qty / max) * 100;
        return `<div class="curve-bar" style="height: ${height}%" data-label="${cmc}"></div>`;
    }).join("");
}

function saveDeckToStorage(deck: SavedDeck) {
    const all = getAllSavedDecks();
    const index = all.findIndex(d => d.id === deck.id);
    if (index >= 0) all[index] = deck;
    else all.push(deck);
    localStorage.setItem('mtg_decks', JSON.stringify(all));
}

function getAllSavedDecks(): SavedDeck[] {
    const data = localStorage.getItem('mtg_decks');
    return data ? JSON.parse(data) : [];
}

function loadSavedDecks() {
    const all = getAllSavedDecks().sort((a,b) => b.timestamp - a.timestamp);
    savedDecksList.innerHTML = all.map(deck => `
        <li class="deck-item ${deck.id === currentDeckId ? 'active' : ''}" onclick="window.selectDeck('${deck.id}')">
            <span>${deck.mission.substring(0, 20)}...</span>
            <small>${new Date(deck.timestamp).toLocaleDateString()}</small>
        </li>
    `).join("");
}

// Global hook for sidebar selection
(window as any).selectDeck = (id: string) => {
    const all = getAllSavedDecks();
    const deck = all.find(d => d.id === id);
    if (deck) {
        currentDeckId = deck.id;
        currentDeck = deck.deck;
        missionInput.value = deck.mission;
        coreInput.value = deck.coreCards;
        updateResultsUI(deck.deck);
        loadSavedDecks();
    }
};

document.getElementById('copy-btn')?.addEventListener('click', () => {
    navigator.clipboard.writeText(decklistOutput.innerText);
});
