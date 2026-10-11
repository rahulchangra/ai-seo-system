import { describe, it, expect } from "vitest";
import { LifecycleStateMachine } from "../state-machine";

describe("SEO Execution Lifecycle State Machine", () => {
  it("allows valid forward transitions", () => {
    expect(LifecycleStateMachine.canTransition("DISCOVERED", "AUDITED")).toBe(true);
    expect(LifecycleStateMachine.canTransition("AUDITED", "ROADMAP_GENERATED")).toBe(true);
    expect(LifecycleStateMachine.canTransition("ROADMAP_GENERATED", "AWAITING_APPROVAL")).toBe(true);
    expect(LifecycleStateMachine.canTransition("AWAITING_APPROVAL", "APPROVED")).toBe(true);
    expect(LifecycleStateMachine.canTransition("APPROVED", "EXECUTING")).toBe(true);
    expect(LifecycleStateMachine.canTransition("EXECUTING", "VERIFYING")).toBe(true);
    expect(LifecycleStateMachine.canTransition("VERIFYING", "COMPLETED")).toBe(true);
  });

  it("blocks illegal transitions", () => {
    // Cannot skip directly from DISCOVERED to COMPLETED
    expect(LifecycleStateMachine.canTransition("DISCOVERED", "COMPLETED")).toBe(false);
    // Cannot jump from AWAITING_APPROVAL directly to VERIFYING
    expect(LifecycleStateMachine.canTransition("AWAITING_APPROVAL", "VERIFYING")).toBe(false);
  });

  it("throws descriptive error on invalid transition assertion", () => {
    expect(() =>
      LifecycleStateMachine.assertValidTransition("DISCOVERED", "COMPLETED")
    ).toThrow(/Invalid lifecycle transition/);
  });
});
