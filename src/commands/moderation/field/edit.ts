import { KaeCommand } from '#lib/structures/commands/KaeCommand';
import { StatusCode } from '#lib/types/enum';
import { getFieldByName, updateField } from '#lib/utils/field';

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

		if (fieldData.status !== StatusCode.SUCCESS) return interaction.editReply(fieldData.message);

		switch (options) {
			case 'fieldname':
				fieldData.data!.nameField = value;
				break;
			case 'name':
				fieldData.data!.name = value;
				break;
			case 'value':
				fieldData.data!.value = value;
				break;
			case 'inline':
				fieldData.data!.inline = value === 'true';
				break;
		}

		const { id: idField, guildId: guildIdField, ...newFieldData } = fieldData.data!;

		const isSuccess = await updateField(fieldData.data!.id, newFieldData);

		if (isSuccess.status !== StatusCode.SUCCESS) return interaction.editReply(isSuccess.message);

		return interaction.editReply(`Field property "${options}" updated to "${value}"`);
	}
}
