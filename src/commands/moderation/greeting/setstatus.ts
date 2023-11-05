import { KaeCommand } from '#lib/structures/commands/KaeCommand';
import { StatusCode } from '#lib/types/enum';
import { getGreetingsByGuildId, changeStatus, generateEmbed } from '#lib/utils/greeting';

export class SetStatusCommand extends KaeCommand {
	public constructor(context: KaeCommand.Context, options: KaeCommand.Options) {
		super(context, {
			...options,
			preconditions: [],
			registerSubCommand: {
				parentCommandName: 'greeting',
				slashSubcommand: (builder) =>
					builder
						.setName('setstatus')
						.setDescription('Set greeting status in this guild')
						.addBooleanOption((input) =>
							input.setName('status').setDescription('Status for the greeting in this guild').setRequired(true)
						)
			}
		});
	}

	public override async chatInputRun(interaction: KaeCommand.ChatInputCommandInteraction) {
		await interaction.deferReply();

		const greeting = await getGreetingsByGuildId(interaction.guildId!);

		if (greeting.status !== StatusCode.SUCCESS) return interaction.editReply(greeting.message);

		const status = interaction.options.get('status', true).value;

		const updateGreeting = await changeStatus(greeting.data!.id, status as boolean);

		if (updateGreeting.status !== StatusCode.SUCCESS) return interaction.editReply(updateGreeting.message);

		const welcomeChannel = interaction.guild!.channels.cache.get(updateGreeting.data!.welcomeChannel as string)?.id;
		const leaveChannel = interaction.guild!.channels.cache.get(updateGreeting.data!.leaveChannel as string)?.id;
		const welcomeEmbed = updateGreeting.data!.welcomeEmbed?.name;
		const leaveEmbed = updateGreeting.data!.leaveEmbed?.name;

		return interaction.editReply({
			embeds: [
				await generateEmbed({
					welcomeChannel,
					leaveChannel,
					welcomeEmbed,
					leaveEmbed,
					status: updateGreeting.data!.enabled
				})
			]
		});
	}
}
