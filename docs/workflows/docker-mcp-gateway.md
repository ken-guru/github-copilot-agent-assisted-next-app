# Docker MCP Gateway Setup

This project now routes every MCP request through Docker's MCP Gateway so that our tools run inside hardened containers with enforced CPU, memory, and networking limits. The gateway is the security boundary for the four approved tools we rely on:

- **Context7** – real-time, contextual library and API documentation.
- **GitHub Official** – access to issues, PRs, reviews, and repo metadata.
- **Microsoft Learn** – snippet and example content from official Microsoft docs.
- **Playwright** – browser automation for UI verification work.

When the Gateway is running, these servers are exposed automatically through the Visual Studio Code Agent mode and any other MCP client that connects to the gateway.

## Prerequisites

1. **Docker Desktop with MCP Toolkit enabled** – follow the [Docker MCP Toolkit guide](https://docs.docker.com/ai/mcp-catalog-and-toolkit/toolkit/) to enable the Toolkit UI. The toolkit orchestrates the gateway, catalog, and OAuth-based authentication for the servers.
2. **Alternative CLI install (if you do not use Docker Desktop)** – download the latest binary from the [Docker MCP Gateway releases page](https://github.com/docker/mcp-gateway/releases/latest) and place it in your CLI plugin directory (see the [Install the MCP Gateway manually](https://docs.docker.com/ai/mcp-catalog-and-toolkit/mcp-gateway/#install-the-mcp-gateway-manually) section for exact paths and chmod instructions).
3. **Enable the gateway CLI plugin** – running `docker mcp gateway run` will start the gateway. Our local `.vscode/mcp.json` already layers the preferred options (`--verify-signatures`, `--log-calls`, `--block-network`, `--block-secrets`, `--cpus 1`, `--memory 1Gb`), but you can adjust them if you need a lighter/broader configuration.

## Gateway setup steps

1. **Launch Docker Desktop** and open the MCP Toolkit workspace. The gateway runs in the background once the toolkit is enabled, but you can also keep a terminal open with `docker mcp gateway run` for explicit control (see the [Manage the MCP Gateway from the CLI](https://docs.docker.com/ai/mcp-catalog-and-toolkit/mcp-gateway/#manage-the-mcp-gateway-from-the-cli) section for more commands).
3. **Browse the MCP Catalog** at [https://docs.docker.com/ai/mcp-catalog-and-toolkit/catalog/](https://docs.docker.com/ai/mcp-catalog-and-toolkit/catalog/) or from the Toolkit UI. Search for and add each approved server: `context7`, `github-official`, `microsoft-learn`, and `playwright`. Enable any OAuth authentication prompts so that the servers can access GitHub, Microsoft Learn, or browser automation resources.
4. **Verify the clients** – in the Toolkit's Clients tab, ensure your Visual Studio Code Agent, Claude Desktop, or other MCP client is connected. The gateway proxies requests from the client to the approved servers.
4. **Start Visual Studio Code in Agent mode** and confirm that the four tools appear in the tool picker. If a server is missing, rerun `docker mcp server enable <name>` and refresh the client.
## Gateway security flags

The CLI invocation that powers the gateway in this repository is stored in `.vscode/mcp.json`. It applies the following flags every time the gateway launches so that tooling runs with additional guardrails:

- `--verify-signatures` ensures only signed server images are allowed.
- `--log-calls` surfaces every tool invocation for auditability.
- `--block-network` prevents outbound network calls unless explicitly opened by the Toolkit.
- `--block-secrets` drops any secret material from tool requests.
- `--cpus 1` and `--memory 1Gb` cap how much host CPU and RAM each MCP container can consume.

Keep that file in sync if you tweak the gateway arguments locally; the README also links here so everyone can replicate the same secure defaults.


## Manual CLI workflow (optional)

If you prefer to work entirely from the command line, the Docker CLI exposes the same functionality:

```bash
# enable a server from the catalog
docker mcp server enable github-official

docker mcp server enable context7

docker mcp server enable microsoft-learn

docker mcp server enable playwright

# connect a client such as Visual Studio Code or Claude
docker mcp client connect claude-code

# run the gateway with the same flags we use locally
docker mcp gateway run --verify-signatures --log-calls --block-network --block-secrets --cpus 1 --memory 1Gb
```

The CLI workflow helps when you need to script environment bootstrap or run the gateway on a headless machine.

## Staying secure

- The gateway blocks secrets and outbound network access unless explicitly granted by the toolkit configuration.
- Each MCP server runs with CPU and memory caps, and containers are signed and versioned via Docker's catalog (see the Toolkit's [Security](https://docs.docker.com/ai/mcp-catalog-and-toolkit/toolkit/#security) section for details).
- OAuth permissions can be reviewed from the Toolkit UI's OAuth tab. Revoke access immediately after you finish troubleshooting a server.

## Troubleshooting tips

- Use `docker mcp gateway status` or `docker ps` to confirm the gateway container is running.
- If Visual Studio Code does not show the tools, restart the agent and run `docker mcp server list` to confirm the servers are enabled.
- Consult the gateway's logs via `docker mcp gateway run --log-calls` to capture diagnostics when requests fail.

## Additional reading

- [Docker MCP Gateway overview](https://docs.docker.com/ai/mcp-catalog-and-toolkit/mcp-gateway/#how-it-works)
- [Docker MCP Toolkit guide](https://docs.docker.com/ai/mcp-catalog-and-toolkit/toolkit/#usage-examples)
- [MCP Catalog](https://docs.docker.com/ai/mcp-catalog-and-toolkit/catalog/)
- [CLI installation instructions](https://docs.docker.com/ai/mcp-catalog-and-toolkit/mcp-gateway/#install-the-mcp-gateway-manually)
