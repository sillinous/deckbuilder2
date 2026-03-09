import { Deck } from './builder';

export class Simulator {
    /**
     * Simulated win rate against a "standard" field.
     * In a full implementation, this would run 10,000 games behind the scenes.
     */
    static simulateMatchups(deck: Deck): number {
        // Placeholder for Monte Carlo Tree Search simulation against meta archetypes.
        // Returns randomized winrate for now.
        return 45 + Math.random() * 20;
    }

    /**
     * Determines "Who's the Beatdown?" in a matchup.
     * Evaluates pressure vs removal/permission ratios.
     */
    static determineRole(myDeck: Deck, oppDeck: Deck): "beatdown" | "control" {
        // Simple logic based on average mana value and creature count.
        const myAvgMV = this.getAverageManaValue(myDeck);
        const oppAvgMV = this.getAverageManaValue(oppDeck);
        
        return myAvgMV < oppAvgMV ? "beatdown" : "control";
    }

    private static getAverageManaValue(deck: Deck): number {
        const spells = deck.mainboard.filter(c => c.manaValue !== undefined);
        if (spells.length === 0) return 3;
        const totalMV = spells.reduce((sum, c) => sum + (c.manaValue! * c.quantity), 0);
        const totalCards = spells.reduce((sum, c) => sum + c.quantity, 0);
        return totalMV / totalCards;
    }
}
