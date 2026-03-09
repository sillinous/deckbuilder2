import { Card, Deck } from './builder';
import { cumulativeHypergeometricProbability } from '../utils/math';

export class Refiner {
    /**
     * Optimizes the mana base for a 60-card deck.
     * Goals: 24 lands split by color requirements.
     */
    static refineManaBase(deck: Deck): Deck {
        // Logic to calculate sources needed based on p-values (Hypergeometric)
        // For now, a simplified version that ensures at least 24 lands.
        const currentLands = deck.mainboard.filter(c => c.name === "Basic Land");
        const landCount = currentLands.reduce((sum, c) => sum + c.quantity, 0);

        if (landCount < 24) {
            // Add remaining lands to reach 24
            const firstLand = currentLands[0];
            if (firstLand) {
                firstLand.quantity += (24 - landCount);
            } else {
                deck.mainboard.push({ name: "Basic Land", quantity: 24 });
            }
        }
        return deck;
    }

    /**
     * Simple mana curve analysis.
     */
    static analyzeCurve(deck: Deck): Map<number, number> {
        const curve = new Map<number, number>();
        deck.mainboard.forEach(card => {
            if (card.manaValue !== undefined) {
                const count = curve.get(card.manaValue) || 0;
                curve.set(card.manaValue, count + card.quantity);
            }
        });
        return curve;
    }
}
