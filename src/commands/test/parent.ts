import { KaeSubcommand } from '#structures/commands/KaeCommand';
import { ApplicationCommandRegistry } from '@sapphire/framework';

export class ParentCommand extends KaeSubcommand {
	public constructor(context: KaeSubcommand.Context, options: KaeSubcommand.Options) {
		super(context, {
			...options,
			name: 'test',
			preconditions: ['BotOwner'],
			requiredUserPermissions: ['Administrator'],
			requiredClientPermissions: ['Administrator']
		});
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((ctx) => {
			this.hooks.subcommands(this, ctx);

			return ctx.setName(this.name).setDescription('Testing command');
		});
	}
}
