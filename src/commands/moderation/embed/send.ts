import { KaeCommand } from '#lib/structures/commands/KaeCommand';
import { StatusCode } from '#lib/types/enum';
import { generateEmbed, getEmbedByName } from '#lib/utils/embed';
import { ChannelType, TextBasedChannel } from 'discord.js';

export class SendCommand extends KaeCommand {
	public constructor(context: KaeCommand.Context, options: KaeCommand.Options) {
		super(context, {
			...options,
			preconditions: [],
			registerSubCommand: {
				parentCommandName: 'embed',
				slashSubcommand: (builder) =>
					builder
						.setName('send')
						.setDescription('Send embed')
						.addStringOption((input) => input.setName('embed').setDescription('Embed name').setRequired(true).setAutocomplete(true))
						.addChannelOption((input) =>
							input.setName('channel').setDescription('Channel').setRequired(true).addChannelTypes(ChannelType.GuildText)
						)
			}
		});
	}

	public override async chatInputRun(interaction: KaeCommand.ChatInputCommandInteraction) {
		await interaction.deferReply();

		const embedName = interaction.options.getString('embed', true);
		const channel = interaction.options.getChannel('channel', true) as TextBasedChannel;

		const embedData = await getEmbedByName(embedName, interaction.guildId!);

		if (embedData.status !== StatusCode.SUCCESS) return interaction.editReply(embedData.message);

		const guildChannel = interaction.guild!.channels.cache.get(channel.id) as TextBasedChannel;

		const embed = await generateEmbed(embedData.data!.id, interaction);

		if (embed.status !== StatusCode.SUCCESS) return interaction.editReply(embed.message);

		await guildChannel.send({ embeds: [embed.data!] });

		return interaction.editReply({
			content: `Embed successfully sent!`
		});
	}
}
