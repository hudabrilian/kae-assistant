import { KaeCommand } from '../../../lib/structures/commands/KaeCommand';
import KaeEmbed from '../../../lib/structures/embeds/KaeEmbed';
import { StatusCode } from '../../../lib/types/enum';
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

		if (guild.status !== StatusCode.SUCCESS) {
			return interaction.editReply({
				embeds: [new KaeEmbed().setTitle('Something went wrong').setDescription(guild.message)]
			});
		}

		return interaction.editReply({
			embeds: [new KaeEmbed().setTitle('Language').setDescription(`Current bot language: ${guild.data!.language}`)]
		});
	}
}
