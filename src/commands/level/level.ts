import { ApplyOptions } from '@sapphire/decorators';
import { KaeCommand } from '../../lib/structures/commands/KaeCommand';
import KaeEmbed from '../../lib/structures/embeds/KaeEmbed';

@ApplyOptions<KaeCommand.Options>({
	description: 'Level system'
})
export class LevelCommand extends KaeCommand {
	public override registerApplicationCommands(registry: KaeCommand.Registry) {
		registry.registerChatInputCommand((builder) => {
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addBooleanOption((input) => input.setName('status').setDescription('Status level system in this guild'));
		});
	}

	public override async chatInputRun(interaction: KaeCommand.ChatInputCommandInteraction) {
		await interaction.deferReply();

		const status = interaction.options.getBoolean('status');

		const guildLevel = await this.container.level.getLevelGuildByGuildId(interaction.guildId!);

		if (status !== null) await this.container.level.setLevelGuild(interaction.guildId!, status);

		if (!guildLevel)
			return interaction.editReply({
				embeds: [new KaeEmbed().setTitle('Something went wrong').setDescription('The guild was not found')]
			});

		return interaction.editReply({
			embeds: [
				new KaeEmbed().setTitle('Guild level system').setDescription(`Level system is \`${guildLevel.status ? 'enabled' : 'disabled'}\``)
			]
		});
	}
}
