import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandType, Message } from 'discord.js';
import { KaeCommand } from '../lib/structures/commands/KaeCommand';

@ApplyOptions<KaeCommand.Options>({
	description: 'ping pong'
})
export class UserCommand extends KaeCommand {
	// Register Chat Input and Context Menu command
	public override registerApplicationCommands(registry: KaeCommand.Registry) {
		// Register Chat Input command
		registry.registerChatInputCommand({
			name: this.name,
			description: this.description
		});

		// Register Context Menu command available from any message
		registry.registerContextMenuCommand({
			name: this.name,
			type: ApplicationCommandType.Message
		});

		// Register Context Menu command available from any user
		registry.registerContextMenuCommand({
			name: this.name,
			type: ApplicationCommandType.User
		});
	}

	// Message command
	public override async messageRun(message: Message) {
		return this.sendPing(message);
	}

	// Chat Input (slash) command
	public override async chatInputRun(interaction: KaeCommand.ChatInputCommandInteraction) {
		return this.sendPing(interaction);
	}

	// Context Menu command
	public override async contextMenuRun(interaction: KaeCommand.ContextMenuCommandInteraction) {
		return this.sendPing(interaction);
	}

	private async sendPing(interactionOrMessage: Message | KaeCommand.ChatInputCommandInteraction | KaeCommand.ContextMenuCommandInteraction) {
		const title = await this.resolveCommandKey(interactionOrMessage, 'success.title');
		const pingMessage =
			interactionOrMessage instanceof Message
				? await interactionOrMessage.channel.send({ content: title })
				: await interactionOrMessage.reply({
						content: title,
						fetchReply: true
				  });

		const content = await this.resolveCommandKey(interactionOrMessage, 'success.description', {
			replace: {
				bot: Math.round(this.container.client.ws.ping),
				api: pingMessage.createdTimestamp - interactionOrMessage.createdTimestamp
			}
		});

		if (interactionOrMessage instanceof Message) {
			return pingMessage.edit({ content });
		}

		return interactionOrMessage.editReply({
			content: content
		});
	}
}
