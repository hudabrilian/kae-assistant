import { KaeCommand } from '../../../lib/structures/commands/KaeCommand';
import { createEmbed, getEmbedByName } from '../../../lib/utils/embed';

export class CreateCommand extends KaeCommand {
	public constructor(context: KaeCommand.Context, options: KaeCommand.Options) {
		super(context, {
			...options,
			preconditions: [],
			registerSubCommand: {
				parentCommandName: 'embed',
				slashSubcommand: (builder) =>
					builder
						.setName('create')
						.setDescription('Create new embed')
						.addStringOption((input) => input.setName('embed').setDescription('Embed name').setRequired(true))
			}
		});
	}

	public override async chatInputRun(interaction: KaeCommand.ChatInputCommandInteraction) {
		await interaction.deferReply();

		const embedName = interaction.options.getString('embed', true);

		const embedData = await getEmbedByName(embedName, interaction.guildId!);

		if (embedData) return interaction.editReply('Embed already exists');

		const embed = await createEmbed(embedName, interaction.guildId!);

		if (!embed) return interaction.editReply('Failed to create embed');

		return interaction.editReply({ content: 'Embed successfully created' });
	}
}