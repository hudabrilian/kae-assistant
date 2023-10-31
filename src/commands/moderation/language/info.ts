import { KaeCommand } from '../../../lib/structures/commands/KaeCommand';
import KaeEmbed from '../../../lib/structures/embeds/KaeEmbed';
import { getGuild } from '../../../lib/utils/guild';

export class InfoCommand extends KaeCommand {
	public constructor(context: KaeCommand.Context, options: KaeCommand.Options) {
		super(context, {
			...options,
			preconditions: [],
			registerSubCommand: {
				parentCommandName: 'language',
				slashSubcommand: (builder) => builder.setName('info').setDescription('Information bot language in current guild')
			}
		});
	}

	public override async chatInputRun(interaction: KaeCommand.ChatInputCommandInteraction) {
		await interaction.deferReply();

		const guild = await getGuild(interaction.guild!.id);

		if (!guild) {
			return interaction.editReply({
				embeds: [new KaeEmbed().setTitle('Something went wrong').setDescription('The guild was not found')]
			});
		}

		return interaction.editReply({
			embeds: [new KaeEmbed().setTitle('Language').setDescription(`Current bot language: ${guild.language}`)]
		});
	}
}
