import { KaeCommand } from '#lib/structures/commands/KaeCommand';
import { StatusCode } from '#lib/types/enum';
import { generateEmbed, setLeaveChannel } from '#lib/utils/greeting';
import { ChannelType } from 'discord.js';

export class SetChannelCommand extends KaeCommand {
	public constructor(context: KaeCommand.Context, options: KaeCommand.Options) {
		super(context, {
			...options,
			name: 'setchannel',
			description: 'Set leave greeting channel',
			preconditions: [],
			registerSubcommmandInGroup: {
				parentCommandName: 'greeting',
				groupName: 'leave',
				slashSubcommand: (builder) =>
					builder
						.setName('setchannel')
						.setDescription('Set leave greeting channel')
						.addChannelOption((input) =>
							input
								.setName('channel')
								.setDescription('The leave greeting channel')
								.setRequired(true)
								.addChannelTypes(ChannelType.GuildText)
						)
			}
		});
	}

	public override async chatInputRun(interaction: KaeCommand.ChatInputCommandInteraction) {
		await interaction.deferReply();
		const channel = interaction.options.get('channel', true);

		const greeting = await setLeaveChannel(interaction.guildId!, channel.channel!.id);

		if (greeting.status !== StatusCode.SUCCESS) return interaction.editReply(greeting.message);

		const welcomeChannel = interaction.guild!.channels.cache.get(greeting.data!.welcomeChannel as string)?.id;
		const leaveChannel = interaction.guild!.channels.cache.get(greeting.data!.leaveChannel as string)?.id;

		return interaction.editReply({
			embeds: [
				await generateEmbed({
					welcomeChannel: welcomeChannel!,
					leaveChannel: leaveChannel!,
					welcomeEmbed: greeting.data!.welcomeEmbed?.name,
					leaveEmbed: greeting.data!.leaveEmbed?.name,
					status: greeting.data!.enabled
				})
			]
		});
	}
}
