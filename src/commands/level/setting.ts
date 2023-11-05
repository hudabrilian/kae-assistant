import { KaeCommand } from '#lib/structures/commands/KaeCommand';
import KaeEmbed from '#lib/structures/embeds/KaeEmbed';
import { StatusCode } from '#lib/types/enum';

export class LevelCommand extends KaeCommand {
	public constructor(context: KaeCommand.Context, options: KaeCommand.Options) {
		super(context, {
			...options,
			preconditions: [],
			registerSubCommand: {
				parentCommandName: 'level',
				slashSubcommand: (builder) =>
					builder
						.setName('setting')
						.setDescription('Guild level settings')
						.addBooleanOption((input) => input.setName('status').setDescription('Status level system in this guild'))
			}
		});
	}

	public override async chatInputRun(interaction: KaeCommand.ChatInputCommandInteraction) {
		await interaction.deferReply();

		const status = interaction.options.getBoolean('status');

		const guildLevel = await this.container.level.getLevelGuildByGuildId(interaction.guildId!);

		if (status !== null) await this.container.level.setLevelGuild(interaction.guildId!, status);

		if (guildLevel.status !== StatusCode.SUCCESS)
			return interaction.editReply({
				embeds: [new KaeEmbed().setTitle('Something went wrong').setDescription(guildLevel.message)]
			});

		return interaction.editReply({
			embeds: [
				new KaeEmbed().setTitle('Guild level system').setDescription(`Level system is \`${guildLevel.status ? 'enabled' : 'disabled'}\``)
			]
		});
	}
}
