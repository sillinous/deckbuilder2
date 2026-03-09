import { Deck } from '../components/builder';
import { Refiner } from '../components/refiner';

export class Assistant {
    /**
     * Suggests new deck assets (cards/strategies) based on the current deck.
     */
    static suggestExtensions(deck: Deck): string[] {
        const currentRef = Refiner.analyzeCurve(deck);
        // In a real implementation, this would query the NotebookLM/Meta-API
        return ["Meathook Massacre II [DSK]", "Abhorrent Oculus [DSK]", "Glimmer Knight [DSK]"];
    }

    /**
     * Explains the strategic value of the deck's mission.
     */
    static explainStrategy(deck: Deck): string {
        return `Your mission statement is: "${deck.missionStatement}". Based on your curve, you are well-positioned for the early game, but may struggle against Control if you don't draw your finishers by turn 5.`;
    }
}
