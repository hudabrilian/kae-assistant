import { KaeCommand } from '../../../lib/structures/commands/KaeCommand';
import { getFieldByName, removeField } from '../../../lib/utils/field';

export class RemoveCommand extends KaeCommand {
	public constructor(context: KaeCommand.Context, options: KaeCommand.Options) {
		super(context, {
			...options,
			preconditions: [],
			registerSubCommand: {
				parentCommandName: 'field',
				slashSubcommand: (builder) =>
					builder
						.setName('remove')
						.setDescription('Remove field')
						.addStringOption((input) => input.setName('fieldname').setDescription('Field name').setRequired(true).setAutocomplete(true))
			}
		});
	}

	public override async chatInputRun(interaction: KaeCommand.ChatInputCommandInteraction) {
		await interaction.deferReply();

		const fieldName = interaction.options.getString('fieldname', true);

		const fieldData = await getFieldByName(fieldName, interaction.guildId!);

		if (!fieldData) return interaction.editReply('Field is not exists');

		await removeField(fieldData.id);

		return interaction.editReply({ content: 'Field successfully removed' });
	}
}
