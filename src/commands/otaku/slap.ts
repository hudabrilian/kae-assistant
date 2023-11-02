import { ApplyOptions } from '@sapphire/decorators';
import { KaeCommand } from '../../lib/structures/commands/KaeCommand';
import { ApplicationCommandType, userMention } from 'discord.js';
import { getImage } from '../../lib/utils/otaku';
import KaeEmbed from '../../lib/structures/embeds/KaeEmbed';

@ApplyOptions<KaeCommand.Options>({
	name: 'slap',
	description: 'slap reaction'
})
export class SlapCommand extends KaeCommand {
	public override registerApplicationCommands(registry: KaeCommand.Registry) {
		// Register Chat Input command
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addUserOption((option) => option.setName('user').setDescription('user to slap').setRequired(true))
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

		const userToSlap = interaction.options.getUser('user', true);

		const userToSlapMention = userMention(userToSlap.id);
		const interactionUserMention = userMention(interaction.user.id);

		const slapImage = await getImage('slap');
		const embed = new KaeEmbed()
			.setImage(slapImage)
			.setDescription(
				userToSlapMention === interactionUserMention
					? `**${interactionUserMention} gave themselves a slap!**`
					: `**${interactionUserMention} gave ${userToSlapMention} a slap!**`
			);

		return interaction.editReply({
			embeds: [embed],
			allowedMentions: {
				users: [userToSlap.id, interaction.user.id]
			}
		});
	}
}
