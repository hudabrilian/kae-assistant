import { KaeCommand } from '../../lib/structures/commands/KaeCommand';

export class SetCommand extends KaeCommand {
	public constructor(context: KaeCommand.Context, options: KaeCommand.Options) {
		super(context, {
			...options,
			preconditions: [],
			registerSubCommand: {
				parentCommandName: 'test',
				slashSubcommand: (builder) => builder.setName('set').setDescription('Testing set command')
			}
		});
	}

	public override chatInputRun(interaction: KaeCommand.ChatInputCommandInteraction) {
		return interaction.reply('set uwu');
	}
}
