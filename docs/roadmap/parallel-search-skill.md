# Parallel Search Skill Implementation Plan

## Overview
Create a Claude Code skill that integrates with Parallel.ai's Search API using their TypeScript SDK (`parallel-web`). This skill will enable Claude to perform intelligent, AI-optimized web searches that return highly relevant, token-efficient results.

## Background

### What is Parallel Search?
Parallel Search API is a web search tool engineered specifically for AI agents, built on a proprietary web index. Unlike traditional search APIs (like Exa or Tavily) that require two separate calls (one for SERP, another for scraping), Parallel provides all required context in a single API call with token-optimized excerpts.

### Key Features
- **Token-relevance optimization**: Extracts the most information-dense excerpts relevant to the AI's objective
- **Single API call**: Resolves complex queries without sequential calls
- **Cost-effective**: $0.005 per request with 10 results + $0.001 per page extracted
- **Free tier**: Up to 16,000 free search requests
- **Built for AI**: Designed from the ground up for AI agents, not humans

### Technical Foundation
- **SDK**: `parallel-web` npm package (TypeScript SDK)
- **Authentication**: API key via `PARALLEL_API_KEY` environment variable
- **API Version**: Beta version with header `parallel-beta: search-extract-2025-10-10`
- **Endpoint**: `https://api.parallel.ai/v1beta/search`

## Skill Structure

```
.claude/skills/parallel-search/
├── SKILL.md                    # Main skill definition and instructions
├── package.json                # Node.js dependencies
├── tsconfig.json              # TypeScript configuration
├── scripts/
│   ├── search.ts              # Main search script using parallel-web SDK
│   ├── build.sh               # Build script to compile TypeScript
│   └── package.json           # Script-specific package.json
├── references/
│   ├── api-reference.md       # Parallel Search API reference
│   ├── usage-examples.md      # Example use cases and patterns
│   └── best-practices.md      # Best practices for search queries
└── assets/
    └── .env.example           # Example environment variable configuration
```

## Implementation Details

### 1. SKILL.md Structure

**Frontmatter:**
```yaml
---
name: parallel-search
description: Perform AI-optimized web searches using Parallel Search API. Use when you need to find current information from the web, research topics, or gather data that's beyond your knowledge cutoff. Returns token-efficient, highly relevant excerpts.
---
```

**Content Sections:**
1. **Overview**: What the skill does and when to use it
2. **Prerequisites**: API key setup instructions
3. **Usage Instructions**: How to invoke the search script
4. **Parameters**: Detailed parameter descriptions
5. **Examples**: Concrete usage examples
6. **Output Format**: Description of returned data structure
7. **Best Practices**: Tips for optimal search queries

### 2. TypeScript Script (`scripts/search.ts`)

**Core Functionality:**
```typescript
import Parallel from 'parallel-web';

interface SearchOptions {
  objective: string;
  searchQueries?: string[];
  maxResults?: number;
  processor?: 'lite' | 'base' | 'pro';
  excerpts?: boolean;
}

async function performSearch(options: SearchOptions) {
  const client = new Parallel({
    apiKey: process.env.PARALLEL_API_KEY,
  });

  try {
    const result = await client.beta.search({
      objective: options.objective,
      search_queries: options.searchQueries,
      max_results: options.maxResults || 10,
      processor: options.processor || 'base',
      excerpts: options.excerpts !== false,
    });

    return result;
  } catch (error) {
    // Proper error handling with typed errors
    throw new Error(`Search failed: ${error.message}`);
  }
}
```

**Key Features:**
- Type-safe interfaces for all parameters
- Environment variable validation
- Comprehensive error handling
- JSON output for easy parsing
- Support for all Parallel Search API options

### 3. Dependencies (`package.json`)

```json
{
  "name": "@claude-skills/parallel-search",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "build": "tsc",
    "search": "node dist/search.js"
  },
  "dependencies": {
    "parallel-web": "^latest"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  }
}
```

### 4. TypeScript Configuration (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "node",
    "outDir": "./dist",
    "rootDir": "./scripts",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["scripts/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 5. Reference Documentation

**api-reference.md** - Comprehensive API documentation including:
- All available parameters and their types
- Response format and data structures
- Error codes and handling
- Rate limits and quotas
- API versioning information

**usage-examples.md** - Practical examples:
- Simple fact-finding searches
- Research queries with multiple search terms
- Complex multi-step research tasks
- Error handling patterns
- Integration with other tools

**best-practices.md** - Guidelines for:
- Writing effective search objectives
- Choosing the right processor tier (lite/base/pro)
- Optimizing for token efficiency
- Handling large result sets
- Caching strategies

### 6. Environment Setup

**assets/.env.example:**
```
# Parallel Search API Key
# Get your API key from https://platform.parallel.ai/
PARALLEL_API_KEY=your_api_key_here
```

## Implementation Steps

### Phase 1: Core Setup (Estimated: 2-3 hours)
1. **Create skill directory structure**
   - Create `.claude/skills/parallel-search/` directory
   - Set up all subdirectories (scripts/, references/, assets/)

2. **Initialize Node.js/TypeScript project**
   - Create package.json with dependencies
   - Create tsconfig.json with strict mode
   - Install `parallel-web` SDK
   - Set up build scripts

3. **Create basic search script**
   - Implement TypeScript search script with SDK
   - Add parameter parsing (command-line arguments or config file)
   - Implement environment variable validation
   - Add basic error handling

### Phase 2: SKILL.md and Documentation (Estimated: 1-2 hours)
4. **Write SKILL.md**
   - Define frontmatter with name and description
   - Write clear instructions for Claude
   - Include parameter documentation
   - Add usage examples
   - Document prerequisites and setup

5. **Create reference documentation**
   - Write api-reference.md with full API docs
   - Create usage-examples.md with practical examples
   - Write best-practices.md with optimization tips

6. **Add environment template**
   - Create .env.example file
   - Document API key acquisition process

### Phase 3: Advanced Features (Estimated: 2-3 hours)
7. **Enhance search script**
   - Add support for multiple search queries
   - Implement processor tier selection
   - Add result filtering and formatting options
   - Create JSON output mode for easy parsing

8. **Add error handling and validation**
   - Validate API key presence
   - Handle network errors gracefully
   - Provide clear error messages
   - Add retry logic for transient failures

9. **Optimize for Claude integration**
   - Format output for optimal Claude consumption
   - Add verbose/quiet modes
   - Implement result summarization options

### Phase 4: Testing and Refinement (Estimated: 1-2 hours)
10. **Test with various queries**
    - Test simple fact-finding queries
    - Test complex research queries
    - Test error scenarios
    - Validate output formatting

11. **Documentation review**
    - Ensure all examples work
    - Verify instructions are clear
    - Check for typos and formatting issues

12. **Performance optimization**
    - Minimize token usage in responses
    - Optimize result parsing
    - Add caching if beneficial

### Phase 5: Integration and Polish (Estimated: 1 hour)
13. **Final integration testing**
    - Test skill invocation from Claude
    - Verify environment variable handling
    - Test with different parameter combinations

14. **Add usage analytics (optional)**
    - Track common query patterns
    - Monitor performance metrics
    - Identify optimization opportunities

## API Parameters Reference

### Core Parameters
- **objective** (required): A clear, specific description of what information to find
- **search_queries** (optional): Array of specific search terms to use
- **max_results** (optional): Number of results to return (default: 10)
- **processor** (optional): Processing tier - 'lite', 'base', or 'pro' (default: 'base')
- **excerpts** (optional): Whether to include extracted excerpts (default: true)

### Processor Tiers
- **lite**: Fast, cost-effective searches for simple queries
- **base**: Balanced performance for most use cases (recommended)
- **pro**: Maximum accuracy for complex research tasks

## Success Criteria

### Functional Requirements
- ✅ Successfully authenticates with Parallel API
- ✅ Performs searches and returns relevant results
- ✅ Handles errors gracefully with clear messages
- ✅ Outputs results in Claude-friendly format
- ✅ Supports all major API parameters

### Quality Requirements
- ✅ TypeScript code follows best practices (strict mode, proper types)
- ✅ Comprehensive documentation and examples
- ✅ Clear, actionable error messages
- ✅ Token-efficient output formatting
- ✅ Easy to set up and use

### Integration Requirements
- ✅ Works seamlessly with Claude Code
- ✅ Can be invoked via simple commands
- ✅ Integrates with other skills when needed
- ✅ Follows Claude skill conventions

## Future Enhancements

### Phase 2 Features (Future)
1. **Result caching**: Cache recent searches to reduce API calls
2. **Batch search**: Support for multiple simultaneous searches
3. **Search history**: Track and reuse previous searches
4. **Custom processors**: Allow custom search processing logic
5. **Result export**: Export results to various formats (JSON, CSV, Markdown)
6. **Search templates**: Pre-defined search patterns for common tasks

### Integration Opportunities
- **MCP Server**: Create an MCP server for Parallel Search
- **Web UI**: Build a web interface for testing searches
- **Analytics**: Add search analytics and insights
- **Workflows**: Create multi-step research workflows

## Dependencies

### Required
- Node.js >= 18.0.0
- TypeScript >= 5.0.0
- parallel-web npm package

### Development
- @types/node (for TypeScript type definitions)

## Security Considerations

1. **API Key Storage**
   - Never commit API keys to version control
   - Use environment variables only
   - Document secure key management practices

2. **Input Validation**
   - Validate all user inputs
   - Sanitize search queries if needed
   - Prevent injection attacks

3. **Error Handling**
   - Don't expose sensitive error details
   - Log errors securely
   - Provide user-friendly error messages

## Cost Estimation

Based on Parallel.ai pricing:
- Free tier: 16,000 requests
- After free tier: $0.005 per request (10 results)
- Additional pages: $0.001 per page

**Typical usage:**
- Single search with 10 results: $0.005
- 100 searches/day: $0.50/day (~$15/month)
- Within free tier: $0

## Timeline

**Total estimated time: 7-11 hours**

- Phase 1 (Core Setup): 2-3 hours
- Phase 2 (Documentation): 1-2 hours
- Phase 3 (Advanced Features): 2-3 hours
- Phase 4 (Testing): 1-2 hours
- Phase 5 (Integration): 1 hour

**Recommended approach:** Implement in phases, testing thoroughly after each phase.

## Resources

### Official Documentation
- Parallel Search Quickstart: https://docs.parallel.ai/search/search-quickstart
- parallel-web SDK: https://www.npmjs.com/package/parallel-web
- Parallel Search Blog: https://parallel.ai/blog/introducing-parallel-search
- Developer Platform: https://platform.parallel.ai/

### Claude Skills References
- Claude Skills Documentation: https://docs.claude.com/en/docs/claude-code/skills
- Skill Authoring Best Practices: https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices
- Anthropic Skills Repository: https://github.com/anthropics/skills

### TypeScript Resources
- TypeScript Documentation: https://www.typescriptlang.org/docs/
- Node.js TypeScript Guide: https://nodejs.org/en/learn/getting-started/nodejs-with-typescript

## Questions to Address

Before implementation, clarify:

1. **API Access**:
   - Do we have a Parallel.ai API key already?
   - Which pricing tier are we using?

2. **Skill Scope**:
   - Should this be a personal skill (~/.claude/skills/) or project skill (.claude/skills/)?
   - Do we need to support multiple API keys (e.g., team usage)?

3. **Features Priority**:
   - Which processor tier should be the default?
   - Should we implement caching in v1?
   - Do we need result export features immediately?

4. **Integration**:
   - Should this skill integrate with any existing skills?
   - Do we need a companion MCP server?

5. **Documentation**:
   - What level of detail is needed in the reference docs?
   - Should we include video tutorials or just written docs?

## Conclusion

This plan provides a comprehensive roadmap for implementing a Parallel Search skill for Claude Code. The implementation follows Claude skill best practices, uses the official TypeScript SDK, and provides a robust, production-ready integration with Parallel.ai's Search API.

The phased approach allows for incremental development and testing, ensuring quality at each step. The skill will enable Claude to perform intelligent web searches with highly relevant, token-efficient results, significantly enhancing its research capabilities.
