import type {
  GameToReactEvent,
  ReactToGameCommand,
} from "../types/contracts";

type CommandListener = (command: ReactToGameCommand) => void;

/**
 * Tiny typed transport between React and Phaser.
 * It deliberately keeps no application state, so neither side can drift.
 */
export class GameBridge {
  private readonly listeners = new Set<CommandListener>();
  private destroyed = false;

  constructor(
    private readonly eventSink: (event: GameToReactEvent) => void,
  ) {}

  emit(event: GameToReactEvent): void {
    if (!this.destroyed) this.eventSink(event);
  }

  send(command: ReactToGameCommand): void {
    if (this.destroyed) return;
    for (const listener of this.listeners) listener(command);
  }

  onCommand(listener: CommandListener): () => void {
    if (this.destroyed) return () => undefined;
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  destroy(): void {
    this.destroyed = true;
    this.listeners.clear();
  }
}
