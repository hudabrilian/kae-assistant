import { KaeCommand } from '../../../lib/structures/commands/KaeCommand';
import { generateEmbed, getGreetingsByGuildId } from '../../../lib/utils/greeting';

export class InfoCommand extends KaeCommand {
	public constructor(context: KaeCommand.Context, options: KaeCommand.Options) {
		super(context, {
			...options,
			preconditions: [],
			registerSubCommand: {
				parentCommandName: 'greeting',
				slashSubcommand: (builder) => builder.setName('info').setDescription('See greetings information for the current guild')
			}
		});
	}

	public override async chatInputRun(interaction: KaeCommand.ChatInputCommandInteraction) {
		await interaction.deferReply();

		const greeting = await getGreetingsByGuildId(interaction.guildId!);

		if (!greeting) return interaction.editReply('Greeting not found');

		const welcomeChannel = interaction.guild!.channels.cache.get(greeting.welcomeChannel as string)?.id;
		const leaveChannel = interaction.guild!.channels.cache.get(greeting.leaveChannel as string)?.id;
		const welcomeEmbed = greeting.welcomeEmbed?.name;
		const leaveEmbed = greeting.leaveEmbed?.name;

		return interaction.editReply({
			embeds: [
				await generateEmbed({
					welcomeChannel,
					leaveChannel,
					welcomeEmbed,
					leaveEmbed,
					status: greeting.enabled
				})
			]
		});
	}
}
