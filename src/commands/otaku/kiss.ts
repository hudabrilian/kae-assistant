import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandType, userMention } from 'discord.js';
import KaeEmbed from '../../lib/structures/embeds/KaeEmbed';
import { getImage } from '../../lib/utils/otaku';
import { KaeCommand } from '../../lib/structures/commands/KaeCommand';

@ApplyOptions<KaeCommand.Options>({
	name: 'kiss',
	description: 'kiss reaction'
})
export class KissCommand extends KaeCommand {
	// Register Chat Input command
	public override registerApplicationCommands(registry: KaeCommand.Registry) {
		// Register Chat Input command
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addUserOption((option) => option.setName('user').setDescription('user to kiss').setRequired(true))
		);

		// Register Context Menu command available from any user
		registry.registerContextMenuCommand({
			name: this.name,
			type: ApplicationCommandType.User
		});

		// Register Context Menu command available from any user
		registry.registerContextMenuCommand({
			name: this.name,
			type: ApplicationCommandType.Message
		});
	}

	// Chat Input (slash) command
	public override async chatInputRun(interaction: KaeCommand.ChatInputCommandInteraction) {
		return this.sendImage(interaction);
	}

	// Context Menu command
	public override async contextMenuRun(interaction: KaeCommand.ContextMenuCommandInteraction) {
		return this.sendImage(interaction);
	}

	public async sendImage(interaction: KaeCommand.ChatInputCommandInteraction | KaeCommand.ContextMenuCommandInteraction) {
		await interaction.deferReply();

		const userToKiss = interaction.options.getUser('user', true);

		const userToKissMention = userMention(userToKiss.id);
		const interactionUserMention = userMention(interaction.user.id);

		const kissImage = await getImage('kiss');
		const embed = new KaeEmbed()
			.setImage(kissImage)
			.setDescription(
				userToKissMention === interactionUserMention
					? `**${interactionUserMention} gave themselves a kiss!**`
					: `**${interactionUserMention} gave ${userToKissMention} a kiss!**`
			);

		return interaction.editReply({
			embeds: [embed],
			allowedMentions: {
				users: [userToKiss.id, interaction.user.id]
			}
		});
	}
}
