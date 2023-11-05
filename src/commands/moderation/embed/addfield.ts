import { KaeCommand } from '#lib/structures/commands/KaeCommand';
import { StatusCode } from '#lib/types/enum';
import { getEmbedByName, addField } from '#lib/utils/embed';
import { getFieldByName } from '#lib/utils/field';

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

		if (embedData.status !== StatusCode.SUCCESS) return interaction.editReply(embedData.message);

		const fieldData = await getFieldByName(fieldName, interaction.guildId!);

		if (fieldData.status !== StatusCode.SUCCESS) return interaction.editReply(fieldData.message);

		await addField(embedData.data!.id, fieldData.data!.id);

		return interaction.editReply({ content: 'Field successfully added' });
	}
}
