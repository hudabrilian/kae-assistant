import { ApplyOptions } from '@sapphire/decorators';
import { KaeCommand } from '../../lib/structures/commands/KaeCommand';
import KaeEmbed from '../../lib/structures/embeds/KaeEmbed';
import { StatusCode } from '../../lib/types/enum';

@ApplyOptions<KaeCommand.Options>({
	description: 'Leaderboard level in this guild'
})
export class LevelCommand extends KaeCommand {
	public override registerApplicationCommands(registry: KaeCommand.Registry) {
		registry.registerChatInputCommand((builder) => {
			builder.setName(this.name).setDescription(this.description);
		});
	}

	public override async chatInputRun(interaction: KaeCommand.ChatInputCommandInteraction) {
		await interaction.deferReply();

		const userLevels = await this.container.level.getLeaderboard(interaction.guildId!);

		if (userLevels.status !== StatusCode.SUCCESS)
			return interaction.editReply({
				embeds: [new KaeEmbed().setTitle('Something went wrong').setDescription(userLevels.message)]
			});

		const embed = new KaeEmbed().setTitle(`${interaction.guild!.name} leaderboard`);

		if (userLevels.data!.length < 1)
			return interaction.editReply({
				embeds: [embed.setDescription('No users found')]
			});

		return interaction.editReply({
			embeds: [
				embed.setDescription(
					userLevels
						.data!.map(
							(user, index) => `${index + 1}. **${interaction.client.users.cache.get(user.user.userId)}** - \`Level: ${user.level}\``
						)
						.join('\n')
				)
			]
		});
	}
}
