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
  private readonly runtimeState = new Map<
    ReactToGameCommand["type"],
    ReactToGameCommand
  >();
  private destroyed = false;

  constructor(
    private readonly eventSink: (event: GameToReactEvent) => void,
  ) {}

  emit(event: GameToReactEvent): void {
    if (!this.destroyed) this.eventSink(event);
  }

  send(command: ReactToGameCommand): void {
    if (this.destroyed) return;
    if (
      command.type === "set-active" ||
      command.type === "set-ui-blocked" ||
      command.type === "set-reduced-motion" ||
      command.type === "set-muted"
    ) {
      this.runtimeState.set(command.type, command);
    }
    for (const listener of this.listeners) listener(command);
  }

  onCommand(listener: CommandListener): () => void {
    if (this.destroyed) return () => undefined;
    this.listeners.add(listener);
    for (const command of this.runtimeState.values()) listener(command);
    return () => this.listeners.delete(listener);
  }

  destroy(): void {
    this.destroyed = true;
    this.listeners.clear();
    this.runtimeState.clear();
  }
}
