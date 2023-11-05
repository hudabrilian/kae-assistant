import { KaeCommand } from '#structures/commands/KaeCommand';

export class ListCommand extends KaeCommand {
	public constructor(context: KaeCommand.Context, options: KaeCommand.Options) {
		super(context, {
			...options,
			preconditions: [],
			registerSubCommand: {
				parentCommandName: 'test',
				slashSubcommand: (builder) => builder.setName('list').setDescription('Testing list command')
			}
		});
	}

	public override chatInputRun(interaction: KaeCommand.ChatInputCommandInteraction) {
		return interaction.reply('uwu');
	}
}
