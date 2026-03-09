import { Builder } from './components/builder';
import { Refiner } from './components/refiner';
import { IOManager } from './components/io_manager';
import { Simulator } from './components/simulator';
import { Assistant } from './assistant/assistant';

const generateBtn = document.getElementById('generate-btn') as HTMLButtonElement;
const resultsArea = document.getElementById('results') as HTMLElement;
const winrateVal = document.getElementById('winrate-val') as HTMLElement;
const landsVal = document.getElementById('lands-val') as HTMLElement;
const assistantText = document.getElementById('assistant-text') as HTMLElement;
const decklistOutput = document.getElementById('decklist-output') as HTMLElement;
const missionInput = document.getElementById('mission') as HTMLInputElement;
const coreInput = document.getElementById('core-cards') as HTMLTextAreaElement;

generateBtn.addEventListener('click', () => {
    const mission = missionInput.value;
    const coreCards = coreInput.value.split(',').map(c => c.trim()).filter(c => c !== "");

    if (coreCards.length === 0) {
        alert("Please enter some core cards!");
        return;
    }

    // Run Core logic
    let deck = Builder.buildRuleOf9(coreCards, mission);
    deck = Refiner.refineManaBase(deck);
    
    const winrate = Simulator.simulateMatchups(deck);
    const advice = Assistant.explainStrategy(deck);
    const mtgaList = IOManager.exportToMTGA(deck);

    // Update UI
    winrateVal.innerText = `${winrate.toFixed(1)}%`;
    landsVal.innerText = deck.mainboard.filter(c => c.name === "Basic Land").reduce((s, c) => s + c.quantity, 0).toString();
    assistantText.innerText = advice;
    decklistOutput.innerText = mtgaList;

    resultsArea.classList.remove('hidden');
    resultsArea.scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('copy-btn')?.addEventListener('click', () => {
    navigator.clipboard.writeText(decklistOutput.innerText);
    alert("Decklist copied to clipboard!");
});
