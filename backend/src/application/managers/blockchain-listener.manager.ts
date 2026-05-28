import { BaseOnChainListener } from "../../infrastructure/blockchain/listeners/base-on-chain.listener";

export class BlockchainListenerManager {
  private listeners: BaseOnChainListener[] = [];

  add(listener: BaseOnChainListener) {
    this.listeners.push(listener);
  }

  startAll() {
    for (const listener of this.listeners) {
      listener.listen();
    }
  }

  stopAll() {
    for (const listener of this.listeners) {
      listener.destroy();
    }
  }
}

export const blockchainListenerManager = new BlockchainListenerManager();
