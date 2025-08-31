import { GameStatus } from '../enums/game-status.enum';
import { GameResult } from '../enums/game-result.enum';

export class GameEngine {
  private static readonly TARGET_VALUE = 21;

  static generateDeck(): string[] {
    const suits = ['♠', '♥', '♦', '♣'];
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

    const deck: string[] = [];
    for (const suit of suits) {
      for (const rank of ranks) {
        deck.push(`${rank}${suit}`);
      }
    }

    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    return deck;
  }

  static dealCards(deck: string[], target: string[], count = 1): void {
    for (let i = 0; i < count; i++) {
      if (deck.length === 0) {
        throw new Error('Deck is empty');
      }
      target.push(deck.pop()!);
    }
  }

  static calculateHandValue(cards: string[]): number {
    let value = 0;
    let aces = 0;

    for (const card of cards) {
      const rank = card.slice(0, -1);
      if (['J', 'Q', 'K'].includes(rank)) {
        value += 10;
      } else if (rank === 'A') {
        aces += 1;
        value += 11;
      } else {
        value += parseInt(rank, 10);
      }
    }

    while (value > GameEngine.TARGET_VALUE && aces > 0) {
      value -= 10;
      aces -= 1;
    }

    return value;
  }

  static checkGameStatus(playerCards: string[], dealerCards: string[],  playerStand = false): { status: GameStatus, result?: GameResult } {
    const playerValue = this.calculateHandValue(playerCards);
    const dealerValue = this.calculateHandValue(dealerCards);
   
    // Bust cases
    if (playerValue > GameEngine.TARGET_VALUE) {
        return { status: GameStatus.FINISHED, result: GameResult.LOSE };
    }
    if (dealerValue > GameEngine.TARGET_VALUE) {
        return { status: GameStatus.FINISHED, result: GameResult.WIN };
    }

    // Blackjack cases
    const playerBlackjack = playerValue === GameEngine.TARGET_VALUE && playerCards.length === 2;
    const dealerBlackjack = dealerValue === GameEngine.TARGET_VALUE && dealerCards.length === 2;

    if (playerBlackjack && dealerBlackjack) {
        return { status: GameStatus.BLACKJACK, result: GameResult.DRAW };
    }
    if (playerBlackjack) {
        return { status: GameStatus.BLACKJACK, result: GameResult.WIN };
    }
    if (dealerBlackjack) {
        return { status: GameStatus.BLACKJACK, result: GameResult.LOSE };
    }

    // Regular end of game (when both stand)
    if (playerStand) {
        if (playerValue > dealerValue) {
            return { status: GameStatus.FINISHED, result: GameResult.WIN };
        }
        if (dealerValue > playerValue) {
            return { status: GameStatus.FINISHED, result: GameResult.LOSE };
        }
        if (playerValue === dealerValue) {
            return { status: GameStatus.FINISHED, result: GameResult.DRAW };
        }
    }

    // Still playing
    return { status: GameStatus.PLAYING };
  }
}
