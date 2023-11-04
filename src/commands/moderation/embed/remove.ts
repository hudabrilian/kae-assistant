import { KaeCommand } from '../../../lib/structures/commands/KaeCommand';
import { StatusCode } from '../../../lib/types/enum';
import { getEmbedByName, removeEmbed } from '../../../lib/utils/embed';

export class RemoveCommand extends KaeCommand {
	public constructor(context: KaeCommand.Context, options: KaeCommand.Options) {
		super(context, {
			...options,
			preconditions: [],
			registerSubCommand: {
				parentCommandName: 'embed',
				slashSubcommand: (builder) =>
					builder
						.setName('remove')
						.setDescription('Remove embed')
						.addStringOption((input) => input.setName('embed').setDescription('Embed name').setRequired(true).setAutocomplete(true))
			}
		});
	}

	public override async chatInputRun(interaction: KaeCommand.ChatInputCommandInteraction) {
		await interaction.deferReply();

		const embedName = interaction.options.getString('embedname', true);

		const embedData = await getEmbedByName(embedName, interaction.guildId!);

		if (embedData.status !== StatusCode.SUCCESS) return interaction.editReply(embedData.message);

		await removeEmbed(embedData.data!.id);

		return interaction.editReply({ content: 'Embed successfully removed' });
	}
}
