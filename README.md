# AltoidMojito

A discord bot for managing the AltoidMojito Minecraft server.

## Getting Started

### Prerequisites

1. Clone the repository.
1. Run `npm install`.
1. Configure the bot by creating a .env file with the appropriate environment variables.
1. Start the bot with `npm start`, or debug using VSCode.

On startup, the bot will log a URL to add AltoidMojito to a discord server.

## Environment Variables

Create a .env file at the root of the project and add the following environment variables:

```sh
ALTOIDMOJITO_CLIENT_ID='<discord bot client id>'
ALTOIDMOJITO_TOKEN='<discord bot token>'
ALTOIDMOJITO_AZURE_SUBSCRIPTION_ID='<azure subscription id>'
ALTOIDMOJITO_AZURE_CLIENT_ID='<azure client id>'
ALTOIDMOJITO_AZURE_APPLICATION_SECRET='<azure application secret>'
ALTOIDMOJITO_AZURE_DOMAIN='<azure domain>'
ALTOIDMOJITO_AZURE_RESOURCE_GROUP='<resource group name>'
ALTOIDMOJITO_AZURE_VM_NAME='<vm name>'
```

### How To Get Values For Environment Variables

- **ALTOIDMOJITO_CLIENT_ID**: Discord Application Client ID. This can be found on the "General Information" page for the relevant [discord application](https://discord.com/developers/applications).
- **ALTOIDMOJITO_TOKEN**: Discord bot token. This can be found on the Application's Bot page.
- **ALTOIDMOJITO_AZURE_SUBSCRIPTION_ID**: The Azure Subscription ID where the minecraft server lives.
- **ALTOIDMOJITO_AZURE_CLIENT_ID**: The Azure Client ID for the service principal the bot will use. This service principal needs the proper Azure roles granted.
- **ALTOIDMOJITO_AZURE_APPLICATION_SECRET**: The application secret for the service principal above.
- **ALTOIDMOJITO_AZURE_DOMAIN**: The Azure tenant where the service principal lives.
- **ALTOIDMOJITO_AZURE_RESOURCE_GROUP**: The resource group containing the Minecraft VM.
- **ALTOIDMOJITO_AZURE_VM_NAME**: The name of the VM running the minecraft server.
