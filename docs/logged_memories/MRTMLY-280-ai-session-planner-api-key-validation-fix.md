### Issue: AI Session Planner API Key Validation Enhancement and 401 Error Prevention
**Date:** 2025-01-15
**Tags:** #debugging #ai-session-planner #api-key-validation #error-handling #ui-improvement
**Status:** Resolved

#### Initial State
- User reports "Invalid or missing OpenAI API key (401)" error in AI session planner even when API key is set
- Error message was generic 401 from OpenAI API without specific guidance
- No validation of API key format before sending to OpenAI API
- Users could enter invalid keys that would fail at API call time
- No debugging information to help diagnose key issues

#### Debug Process
1. **Error Source Investigation**
   - Located error message in `src/utils/ai/byokClient.ts` line 46
   - Confirmed error comes from OpenAI API HTTP 401 response, not client validation
   - This indicated API key was being sent but rejected by OpenAI

2. **API Key Flow Analysis**
   - Traced API key flow: AI page → ApiKeyContext → useOpenAIClient → OpenAI API
   - Found key was being stored and retrieved correctly in context
   - Authorization header format was correct: `Bearer ${apiKey}`
   - Issue was likely invalid key format or content

3. **Root Cause Identification**
   - OpenAI API keys must start with "sk-" and be approximately 51 characters
   - No validation was performed on user input before API calls
   - Users could enter malformed keys (wrong prefix, wrong length, whitespace)
   - Generic 401 error provided no guidance on what was wrong

#### Resolution Implementation
1. **Enhanced API Key Validation in Context**
   ```typescript
   // Added format validation in ApiKeyContext.tsx
   const trimmedKey = key.trim();
   if (!trimmedKey.startsWith('sk-')) {
     throw new Error('Invalid API key format. OpenAI API keys should start with "sk-".');
   }
   if (trimmedKey.length < 40) {
     throw new Error('Invalid API key length. OpenAI API keys should be around 51 characters long.');
   }
   ```

2. **Pre-Flight Validation in BYOK Client**
   ```typescript
   // Added validation in byokClient.ts before API call
   const trimmedKey = apiKey.trim();
   if (!trimmedKey.startsWith('sk-')) {
     throw new Error('Invalid API key format. OpenAI API keys should start with "sk-".');
   }
   if (trimmedKey.length < 40) {
     throw new Error('Invalid API key length. OpenAI API keys are typically 51 characters long.');
   }
   ```

3. **Enhanced User Interface**
   - Added real-time validation feedback in API key input field
   - Enhanced help text with format requirements
   - Added error handling for validation failures in UI
   - Added debug logging (masked key for security)

4. **Improved Error Handling**
   - Validation errors now show before API call
   - Clear error messages guide users to correct format
   - Graceful handling of validation failures in UI

#### Testing Updates
- Updated `ApiKeyContext.test.tsx` with valid key formats for all tests
- Added comprehensive validation test cases:
  - Invalid prefix rejection
  - Short key rejection  
  - Whitespace trimming
  - Valid key acceptance

#### Solution Components Modified
- `src/contexts/ApiKeyContext.tsx` - Added validation logic
- `src/utils/ai/byokClient.ts` - Added pre-flight validation and debug logging
- `src/app/ai/page.tsx` - Enhanced UI validation and error handling
- `src/contexts/__tests__/ApiKeyContext.test.tsx` - Updated tests with valid keys

#### Lessons Learned
- **Early Validation**: Validate user input as early as possible, not just at API call time
- **Clear Error Messages**: Generic HTTP status codes don't help users understand what's wrong
- **Format Guidance**: Provide clear format requirements in UI
- **Defense in Depth**: Validate at multiple layers (UI, context, API client)
- **User Experience**: Help users succeed by preventing common mistakes

#### User Impact
- Users now get immediate feedback on invalid API key format
- Clear guidance on correct key format requirements
- Prevents wasted API calls with invalid keys
- Better debugging information when issues occur
- More confidence in the key entry process

#### Prevention Measures
- Input validation provides real-time feedback
- Enhanced help text guides correct entry
- Multiple validation layers prevent invalid keys from reaching API
- Debug logging helps diagnose any remaining issues
