import { KaeCommand } from '#structures/commands/KaeCommand';
import KaeEmbed from '#structures/embeds/KaeEmbed';
import { StatusCode } from '#types/enum';
import { getImage } from '#utils/otaku';
import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandType, userMention } from 'discord.js';

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

		if (slapImage.status !== StatusCode.SUCCESS) return interaction.editReply(slapImage.message);

		const embed = new KaeEmbed()
			.setImage(slapImage.data!.url)
			.setDescription(
				userToSlapMention === interactionUserMention
					? `**${interactionUserMention} gave themselves a slap!**`
					: `**${interactionUserMention} gave ${userToSlapMention} a slap!**`
			);

		return interaction.editReply({
			embeds: [embed]
		});
	}
}
