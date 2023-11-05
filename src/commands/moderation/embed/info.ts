import { KaeCommand } from '#lib/structures/commands/KaeCommand';
import { StatusCode } from '#lib/types/enum';
import { getEmbedByName, generateEmbed } from '#lib/utils/embed';

export class InfoCommand extends KaeCommand {
	public constructor(context: KaeCommand.Context, options: KaeCommand.Options) {
		super(context, {
			...options,
			preconditions: [],
			registerSubCommand: {
				parentCommandName: 'embed',
				slashSubcommand: (builder) =>
					builder
						.setName('info')
						.setDescription('See embed')
						.addStringOption((input) => input.setName('embed').setDescription('Embed name').setRequired(true).setAutocomplete(true))
			}
		});
	}

	public override async chatInputRun(interaction: KaeCommand.ChatInputCommandInteraction) {
		await interaction.deferReply();

		const embedName = interaction.options.getString('embed', true);

		const embedData = await getEmbedByName(embedName, interaction.guildId!);

		if (embedData.status !== StatusCode.SUCCESS) return interaction.editReply(embedData.message);

		const embed = await generateEmbed(embedData.data!.id, interaction);

		if (embed.status !== StatusCode.SUCCESS) return interaction.editReply(embed.message);

		return interaction.editReply({ embeds: [embed.data!] });
	}
}
