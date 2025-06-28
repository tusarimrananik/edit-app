// ServerStatus.ts

/**
 * This namespace manages the server's busy status.
 */
export namespace ServerStatus {
    // Private variable to hold the busy state.
    let busy: boolean = false;
  
    /**
     * Sets the server busy status.
     * @param status - A boolean indicating whether the server is busy.
     */
    export function setBusy(status: boolean): void {
      busy = status;
    }
  
    /**
     * Retrieves the current busy status of the server.
     * @returns A boolean that is true if the server is busy, false otherwise.
     */
    export function isBusy(): boolean {
      return busy;
    }
  }
  