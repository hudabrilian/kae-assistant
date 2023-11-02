import { KaeCommand } from '../../../lib/structures/commands/KaeCommand';
import { addField, getEmbedByName } from '../../../lib/utils/embed';
import { getFieldByName } from '../../../lib/utils/field';

export class AddFieldCommand extends KaeCommand {
	public constructor(context: KaeCommand.Context, options: KaeCommand.Options) {
		super(context, {
			...options,
			preconditions: [],
			registerSubCommand: {
				parentCommandName: 'embed',
				slashSubcommand: (builder) =>
					builder
						.setName('addfield')
						.setDescription('Add field to embed')
						.addStringOption((input) => input.setName('embed').setDescription('Embed name').setRequired(true).setAutocomplete(true))
						.addStringOption((input) => input.setName('field').setDescription('Field name').setRequired(true).setAutocomplete(true))
			}
		});
	}

	public override async chatInputRun(interaction: KaeCommand.ChatInputCommandInteraction) {
		await interaction.deferReply();

		const embedName = interaction.options.getString('embed', true);
		const fieldName = interaction.options.getString('field', true);

		const embedData = await getEmbedByName(embedName, interaction.guildId!);

		if (!embedData) return interaction.editReply('Embed not found');

		const fieldData = await getFieldByName(fieldName, interaction.guildId!);

		if (!fieldData) return interaction.editReply('Field not found');

		await addField(embedData.id, fieldData.id);

		return interaction.editReply({ content: 'Field successfully added' });
	}
}
