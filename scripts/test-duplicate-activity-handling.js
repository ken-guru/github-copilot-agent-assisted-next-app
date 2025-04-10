// Script to test duplicate activity handling in ActivityStateMachine
const { ActivityStateMachine } = require('../src/utils/activityStateMachine');

// Create an instance of ActivityStateMachine
console.log('Creating ActivityStateMachine instance');
const stateMachine = new ActivityStateMachine();

// Test 1: Add activity with default behavior
console.log('\nTEST 1: Adding activity with default behavior');
try {
  const result = stateMachine.addActivity('activity1');
  console.log(`- First addition result: ${result}`);
} catch (error) {
  console.error(`- Error on first addition: ${error.message}`);
}

// Test 2: Try to add the same activity again with default behavior (should throw)
console.log('\nTEST 2: Attempting to add duplicate activity with default behavior');
try {
  const result = stateMachine.addActivity('activity1');
  console.log(`- Second addition result: ${result}`);
} catch (error) {
  console.error(`- Error on second addition: ${error.message}`);
}

// Test 3: Try to add the same activity again with throwOnExisting=false
console.log('\nTEST 3: Adding duplicate activity with throwOnExisting=false');
try {
  const result = stateMachine.addActivity('activity1', false);
  console.log(`- Addition with throwOnExisting=false result: ${result}`);
} catch (error) {
  console.error(`- Error with throwOnExisting=false: ${error.message}`);
}

// Test 4: Add new activity and verify state handling
console.log('\nTEST 4: Testing state transitions after handling duplicates');
try {
  // Add a new activity
  stateMachine.addActivity('activity2');
  console.log('- Added activity2 successfully');
  
  // Start the activity
  stateMachine.startActivity('activity2');
  console.log('- Started activity2 successfully');
  
  // Try to add it again with throwOnExisting=false
  const result = stateMachine.addActivity('activity2', false);
  console.log(`- Attempt to add activity2 again result: ${result}`);
  
  // Verify state is maintained
  const activityState = stateMachine.getActivityState('activity2');
  console.log(`- activity2 state after duplicate attempt: ${activityState.state}`);
  console.log(`- Current activity ID: ${stateMachine.getCurrentActivity()?.id}`);
} catch (error) {
  console.error(`- Error in test 4: ${error.message}`);
}

console.log('\nTests completed');
