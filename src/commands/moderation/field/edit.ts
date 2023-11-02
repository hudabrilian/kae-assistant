import { KaeCommand } from '../../../lib/structures/commands/KaeCommand';
import { getFieldByName, updateField } from '../../../lib/utils/field';

export class EditCommand extends KaeCommand {
	public constructor(context: KaeCommand.Context, options: KaeCommand.Options) {
		super(context, {
			...options,
			preconditions: [],
			registerSubCommand: {
				parentCommandName: 'field',
				slashSubcommand: (builder) =>
					builder
						.setName('edit')
						.setDescription('Edit field')
						.addStringOption((input) => input.setName('fieldname').setDescription('Field name').setRequired(true).setAutocomplete(true))
						.addStringOption((input) =>
							input
								.setName('options')
								.setDescription('Field options')
								.setRequired(true)
								.addChoices(
									{ name: 'Field name', value: 'fieldname' },
									{ name: 'Name', value: 'name' },
									{ name: 'Value', value: 'value' },
									{ name: 'Inline', value: 'inline' }
								)
						)
						.addStringOption((input) => input.setName('value').setDescription('Value').setRequired(true))
			}
		});
	}

	public override async chatInputRun(interaction: KaeCommand.ChatInputCommandInteraction) {
		await interaction.deferReply();

		const fieldName = interaction.options.getString('fieldname', true);
		const options = interaction.options.getString('options', true);
		const value = interaction.options.getString('value', true);

		const fieldData = await getFieldByName(fieldName, interaction.guildId!);

		if (!fieldData) return interaction.editReply('Field not found');

		switch (options) {
			case 'fieldname':
				fieldData.nameField = value;
				break;
			case 'name':
				fieldData.name = value;
				break;
			case 'value':
				fieldData.value = value;
				break;
			case 'inline':
				fieldData.inline = value === 'true';
				break;
		}

		const { id: idField, guildId: guildIdField, ...newFieldData } = fieldData;

		await updateField(fieldData.id, newFieldData);

		return interaction.editReply(`Field property "${options}" updated to "${value}"`);
	}
}
