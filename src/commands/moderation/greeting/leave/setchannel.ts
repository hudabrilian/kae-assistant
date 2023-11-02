import { ChannelType } from 'discord.js';
import { KaeCommand } from '../../../../lib/structures/commands/KaeCommand';
import { generateEmbed, setLeaveChannel } from '../../../../lib/utils/greeting';

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

		if (!greeting) return interaction.editReply('Failed to update greeting settings');

		const welcomeChannel = interaction.guild!.channels.cache.get(greeting.welcomeChannel as string)?.id;
		const leaveChannel = interaction.guild!.channels.cache.get(greeting.leaveChannel as string)?.id;

		return interaction.editReply({
			embeds: [
				await generateEmbed({
					welcomeChannel: welcomeChannel!,
					leaveChannel: leaveChannel!,
					welcomeEmbed: greeting.welcomeEmbed?.name,
					leaveEmbed: greeting.leaveEmbed?.name,
					status: greeting.enabled
				})
			]
		});
	}
}
