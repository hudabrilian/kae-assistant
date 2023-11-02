import { APIApplicationCommandOptionChoice } from 'discord.js';
import { KaeCommand } from '../../lib/structures/commands/KaeCommand';

const testingEvents: APIApplicationCommandOptionChoice<string>[] = [
	{
		name: 'GuildMemberAdd',
		value: 'guildMemberAdd'
	},
	{
		name: 'GuildMemberRemove',
		value: 'guildMemberRemove'
	}
];

export class EmitCommand extends KaeCommand {
	public constructor(context: KaeCommand.Context, options: KaeCommand.Options) {
		super(context, {
			...options,
			description: 'Emit a custom event.',
			registerSubCommand: {
				parentCommandName: 'test',
				slashSubcommand: (builder) =>
					builder
						.setName('emit')
						.setDescription('Emit a custom event')
						.addStringOption((input) =>
							input
								.setName('event')
								.setDescription('Event name')
								.setRequired(true)
								.addChoices(...Object.values(testingEvents))
						)
			}
		});
	}

	public override async chatInputRun(interaction: KaeCommand.ChatInputCommandInteraction) {
		const event = interaction.options.getString('event', true);

		interaction.client.emit(event, interaction.member);

		interaction.reply({
			content: `Emitted ${event} event.`,
			ephemeral: true
		});
	}
}
