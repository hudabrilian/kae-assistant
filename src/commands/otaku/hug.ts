import { KaeCommand } from '#structures/commands/KaeCommand';
import KaeEmbed from '#structures/embeds/KaeEmbed';
import { StatusCode } from '#types/enum';
import { getImage } from '#utils/otaku';
import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandType, userMention } from 'discord.js';

@ApplyOptions<KaeCommand.Options>({
	name: 'hug',
	description: 'hug reaction'
})
export class HugCommand extends KaeCommand {
	public override registerApplicationCommands(registry: KaeCommand.Registry) {
		// Register Chat Input command
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addUserOption((option) => option.setName('user').setDescription('user to hug').setRequired(true))
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

		const userToHug = interaction.options.getUser('user', true);

		const userToHugMention = userMention(userToHug.id);
		const interactionUserMention = userMention(interaction.user.id);

		const hugImage = await getImage('hug');

		if (hugImage.status !== StatusCode.SUCCESS) return interaction.editReply(hugImage.message);

		const embed = new KaeEmbed()
			.setImage(hugImage.data!.url)
			.setDescription(
				userToHugMention === interactionUserMention
					? `**${interactionUserMention} gave themselves a hug!**`
					: `**${interactionUserMention} gave ${userToHugMention} a hug!**`
			);

		return interaction.editReply({
			embeds: [embed]
		});
	}
}
