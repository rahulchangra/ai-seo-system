export type LifecycleState =
  | "DISCOVERED"
  | "AUDITED"
  | "ROADMAP_GENERATED"
  | "AWAITING_APPROVAL"
  | "APPROVED"
  | "QUEUED"
  | "EXECUTING"
  | "VERIFYING"
  | "COMPLETED"
  | "BLOCKED"
  | "FAILED"
  | "CANCELLED"
  | "REJECTED"
  | "ROLLBACK_REQUIRED"
  | "ROLLED_BACK";

const VALID_TRANSITIONS: Record<LifecycleState, LifecycleState[]> = {
  DISCOVERED: ["AUDITED", "BLOCKED", "CANCELLED"],
  AUDITED: ["ROADMAP_GENERATED", "BLOCKED", "FAILED"],
  ROADMAP_GENERATED: ["AWAITING_APPROVAL", "APPROVED", "CANCELLED", "BLOCKED"],
  AWAITING_APPROVAL: ["APPROVED", "REJECTED", "CANCELLED", "BLOCKED"],
  APPROVED: ["QUEUED", "EXECUTING", "CANCELLED"],
  QUEUED: ["EXECUTING", "BLOCKED", "CANCELLED"],
  EXECUTING: ["VERIFYING", "FAILED", "BLOCKED"],
  VERIFYING: ["COMPLETED", "FAILED", "ROLLBACK_REQUIRED"],
  COMPLETED: ["ROADMAP_GENERATED", "ROLLBACK_REQUIRED"], // can reopen if regression detected
  BLOCKED: ["QUEUED", "AWAITING_APPROVAL", "CANCELLED"],
  FAILED: ["QUEUED", "ROADMAP_GENERATED", "CANCELLED"],
  CANCELLED: ["ROADMAP_GENERATED", "QUEUED"],
  REJECTED: ["ROADMAP_GENERATED", "AWAITING_APPROVAL"],
  ROLLBACK_REQUIRED: ["ROLLED_BACK", "FAILED"],
  ROLLED_BACK: ["ROADMAP_GENERATED", "CANCELLED"],
};

export class LifecycleStateMachine {
  public static canTransition(
    currentState: LifecycleState,
    nextState: LifecycleState
  ): boolean {
    const allowed = VALID_TRANSITIONS[currentState];
    return allowed ? allowed.includes(nextState) : false;
  }

  public static assertValidTransition(
    currentState: LifecycleState,
    nextState: LifecycleState
  ): void {
    if (!this.canTransition(currentState, nextState)) {
      throw new Error(
        `Invalid lifecycle transition from ${currentState} to ${nextState}. Allowed transitions: ${
          VALID_TRANSITIONS[currentState]?.join(", ") || "none"
        }`
      );
    }
  }
}
