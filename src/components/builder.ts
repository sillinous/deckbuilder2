export interface Card {
    name: string;
    quantity: number;
    set?: string;
    collectorNumber?: string;
    typeLine?: string;
    manaValue?: number;
    colors?: string[];
}

export interface Deck {
    mainboard: Card[];
    sideboard: Card[];
    missionStatement?: string;
}

export class Builder {
    /**
     * Implements the Rule of 9 for a 60-card deck.
     * Takes 9 core cards and returns a basic deck structure with 24 lands.
     */
    static buildRuleOf9(coreCards: string[], mission: string): Deck {
        const mainboard: Card[] = coreCards.map(name => ({
            name,
            quantity: 4
        }));

        // Default placeholder for lands
        mainboard.push({ name: "Basic Land", quantity: 24 });

        return {
            mainboard,
            sideboard: [],
            missionStatement: mission
        };
    }

    /**
     * Implements the 8x8 System for a 100-card Commander deck.
     */
    static build8x8(categories: { name: string, cards: string[] }[], commander: string): Deck {
        const mainboard: Card[] = [];
        
        categories.forEach(cat => {
            cat.cards.slice(0, 8).forEach(cardName => {
                mainboard.push({ name: cardName, quantity: 1 });
            });
        });

        // Default placeholder for lands (~35 lands)
        mainboard.push({ name: "Basic Land", quantity: 35 });
        mainboard.push({ name: commander, quantity: 1, typeLine: "Commander" });

        return {
            mainboard,
            sideboard: [],
            missionStatement: `Commander deck led by ${commander}`
        };
    }
}
