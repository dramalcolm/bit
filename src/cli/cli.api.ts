import CommandRegistry from './command-registry';

export default class BitCli {
  constructor(
    /**
     * bit's legacy command registry
     */
    private commandRegistry: CommandRegistry
  ) {}

  /**
   * register a new command to bit's legacy component registry.
   */
  registerCommand() {
    this.commandRegistry.registerCommands();
  }

  /**
   * execute bit's cli
   */
  run() {
    this.commandRegistry.run();
  }
}
