// Simple verification script
const { ActivityStateMachine } = require('./src/utils/activityStateMachine');

// Create a new state machine
const stateMachine = new ActivityStateMachine();

// Add an activity
console.log("Adding activity1 for the first time...");
const firstResult = stateMachine.addActivity('activity1', true);
console.log("Result:", firstResult);

// Try to add it again but don't throw an error
console.log("\nTrying to add activity1 again with throwOnExisting=false...");
const secondResult = stateMachine.addActivity('activity1', false);
console.log("Result:", secondResult);

// Try to add it again and let it throw an error
console.log("\nTrying to add activity1 again with throwOnExisting=true...");
try {
  const thirdResult = stateMachine.addActivity('activity1', true);
  console.log("Result:", thirdResult);
} catch (error) {
  console.log("Error caught:", error.message);
}

console.log("\nVerification complete!");
