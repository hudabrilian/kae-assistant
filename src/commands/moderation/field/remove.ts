import { KaeCommand } from '#lib/structures/commands/KaeCommand';
import { StatusCode } from '#lib/types/enum';
import { removeField } from '#lib/utils/field';
import { getFieldByName } from '#lib/utils/field';

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

		if (fieldData.status !== StatusCode.SUCCESS) return interaction.editReply(fieldData.message);

		await removeField(fieldData.data!.id);

		return interaction.editReply({ content: 'Field successfully removed' });
	}
}
