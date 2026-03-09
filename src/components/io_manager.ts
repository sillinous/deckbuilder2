import { Card, Deck } from './builder';

export class IOManager {
    /**
     * Exports a deck to MTG Arena format string.
     * Format: Quantity Name [SET] Number
     */
    static exportToMTGA(deck: Deck): string {
        let output = "Deck\n";
        deck.mainboard.forEach(card => {
            output += `${card.quantity} ${card.name}`;
            if (card.set && card.collectorNumber) {
                output += ` [${card.set}] ${card.collectorNumber}`;
            }
            output += "\n";
        });

        if (deck.sideboard.length > 0) {
            output += "\nSideboard\n";
            deck.sideboard.forEach(card => {
                output += `${card.quantity} ${card.name}`;
                if (card.set && card.collectorNumber) {
                    output += ` [${card.set}] ${card.collectorNumber}`;
                }
                output += "\n";
            });
        }
        return output;
    }

    /**
     * Basic importer for plain text / MTGA format.
     */
    static importFromText(text: string): Deck {
        const lines = text.split('\n');
        const mainboard: Card[] = [];
        const sideboard: Card[] = [];
        let pickingSideboard = false;

        lines.forEach(line => {
            const trimmed = line.trim();
            if (!trimmed || trimmed === "Deck") return;
            if (trimmed === "Sideboard") {
                pickingSideboard = true;
                return;
            }

            const match = trimmed.match(/^(\d+)\s+(.+?)(?:\s+\[(.+?)\]\s+(\d+))?$/);
            if (match) {
                const card: Card = {
                    quantity: parseInt(match[1]),
                    name: match[2],
                    set: match[3],
                    collectorNumber: match[4]
                };
                if (pickingSideboard) sideboard.push(card);
                else mainboard.push(card);
            }
        });

        return { mainboard, sideboard };
    }
}
