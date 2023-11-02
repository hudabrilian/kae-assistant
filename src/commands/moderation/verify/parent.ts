import { ApplicationCommandRegistry } from '@sapphire/framework';
import { KaeSubcommand } from '../../../lib/structures/commands/KaeCommand';

export class ParentCommand extends KaeSubcommand {
	public constructor(context: KaeSubcommand.Context, options: KaeSubcommand.Options) {
		super(context, {
			...options,
			name: 'verify',
			description: 'Verify system for guild'
		});
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((ctx) => {
			this.hooks.subcommands(this, ctx);

			return ctx.setName(this.name).setDescription(this.description);
		});
	}
}
