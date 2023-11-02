import { KaeCommand } from '../../../../lib/structures/commands/KaeCommand';
import { generateEmbed, setLeaveEmbed } from '../../../../lib/utils/greeting';

export class SetChannelCommand extends KaeCommand {
	public constructor(context: KaeCommand.Context, options: KaeCommand.Options) {
		super(context, {
			...options,
			name: 'setchannel',
			description: 'Set leave greeting embed',
			preconditions: [],
			registerSubcommmandInGroup: {
				parentCommandName: 'greeting',
				groupName: 'leave',
				slashSubcommand: (builder) =>
					builder
						.setName('setembed')
						.setDescription('Set leave greeting embed')
						.addStringOption((input) =>
							input.setName('embed').setDescription('The leave greeting embed').setRequired(true).setAutocomplete(true)
						)
			}
		});
	}

	public override async chatInputRun(interaction: KaeCommand.ChatInputCommandInteraction) {
		await interaction.deferReply();
		const embed = interaction.options.get('embed', true);

		const greeting = await setLeaveEmbed(interaction.guildId!, embed.value as string);

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
