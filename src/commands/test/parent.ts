import { Subcommand } from '@kaname-png/plugin-subcommands-advanced';
import { ApplicationCommandRegistry } from '@sapphire/framework';

export class ParentCommand extends Subcommand {
	public constructor(context: Subcommand.Context, options: Subcommand.Options) {
		super(context, {
			...options,
			name: 'test',
			preconditions: ['BotOwner']
		});
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((ctx) => {
			this.hooks.subcommands(this, ctx);

			return ctx.setName(this.name).setDescription('Testing command');
		});
	}
}
