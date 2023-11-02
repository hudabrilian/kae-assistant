import { KaeCommand } from '../../../lib/structures/commands/KaeCommand';
import { generateEmbed, getEmbedByName } from '../../../lib/utils/embed';

export class InfoCommand extends KaeCommand {
	public constructor(context: KaeCommand.Context, options: KaeCommand.Options) {
		super(context, {
			...options,
			preconditions: [],
			registerSubCommand: {
				parentCommandName: 'embed',
				slashSubcommand: (builder) =>
					builder
						.setName('info')
						.setDescription('See embed')
						.addStringOption((input) => input.setName('embed').setDescription('Embed name').setRequired(true).setAutocomplete(true))
			}
		});
	}

	public override async chatInputRun(interaction: KaeCommand.ChatInputCommandInteraction) {
		await interaction.deferReply();

		const embedName = interaction.options.getString('embed', true);

		const embedData = await getEmbedByName(embedName, interaction.guildId!);

		if (!embedData) return interaction.editReply('Embed not found');

		const embed = await generateEmbed(embedData.id, interaction);

		if (!embed) return interaction.editReply('Failed to create embed');

		return interaction.editReply({ embeds: [embed] });
	}
}
