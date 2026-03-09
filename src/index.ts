import { Builder } from './components/builder';
import { Refiner } from './components/refiner';
import { IOManager } from './components/io_manager';
import { Simulator } from './components/simulator';
import { Assistant } from './assistant/assistant';

async function main() {
    console.log("--- Magic the Gathering AI Deck Builder ---");

    // Example: Building a basic Aggro deck using the Rule of 9
    const coreCards = ["Heartfire Hero", "Manifold Mouse", "Monstrous Rage", "Screaming Nemesis", "Hired Claw", "Might of the Meek", "Emberheart Challenger", "Witchstalker Frenzy", "Rockface Village"];
    let deck = Builder.buildRuleOf9(coreCards, "Aggro - fast pressure and valiant triggers");

    console.log("Initial Deck Mission:", deck.missionStatement);

    // Refine the mana base
    deck = Refiner.refineManaBase(deck);
    console.log("Refined Deck successfully with 24 lands.");

    // Simulate winrate
    const winrate = Simulator.simulateMatchups(deck);
    console.log(`Estimated Winrate: ${winrate.toFixed(1)}%`);

    // AI Advice
    console.log("\n--- Assistant Advice ---");
    console.log(Assistant.explainStrategy(deck));
    console.log("Suggested Additions:", Assistant.suggestExtensions(deck).join(", "));

    // Export to MTG Arena format
    console.log("\n--- MTG Arena Export ---");
    console.log(IOManager.exportToMTGA(deck));
}

main().catch(console.error);
