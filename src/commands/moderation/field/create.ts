import { KaeCommand } from '../../../lib/structures/commands/KaeCommand';
import { createField, getFieldByName } from '../../../lib/utils/field';

export class CreateCommand extends KaeCommand {
	public constructor(context: KaeCommand.Context, options: KaeCommand.Options) {
		super(context, {
			...options,
			preconditions: [],
			registerSubCommand: {
				parentCommandName: 'field',
				slashSubcommand: (builder) =>
					builder
						.setName('create')
						.setDescription('Create new field')
						.addStringOption((input) => input.setName('fieldname').setDescription('Field name').setRequired(true))
						.addStringOption((input) => input.setName('name').setDescription('Field property name').setRequired(true))
						.addStringOption((input) => input.setName('value').setDescription('Field property value').setRequired(true))
						.addBooleanOption((input) => input.setName('inline').setDescription('Field property inline').setRequired(false))
			}
		});
	}

	public override async chatInputRun(interaction: KaeCommand.ChatInputCommandInteraction) {
		await interaction.deferReply();

		const fieldName = interaction.options.getString('fieldname', true);
		const name = interaction.options.getString('name', true);
		const value = interaction.options.getString('value', true);
		const inline = interaction.options.getBoolean('inline', false) || false;

		const fieldData = await getFieldByName(fieldName, interaction.guildId!);

		if (fieldData) return interaction.editReply('Field already exists');

		const field = await createField(fieldName, interaction.guildId!, {
			name,
			value,
			inline
		});

		if (!field) return interaction.editReply('Failed to create field');

		return interaction.editReply({ content: 'Field successfully created' });
	}
}
