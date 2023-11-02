import { ApplicationCommandRegistry } from '@sapphire/framework';
import { KaeSubcommand } from '../../../lib/structures/commands/KaeCommand';

export class ParentCommand extends KaeSubcommand {
	public constructor(context: KaeSubcommand.Context, options: KaeSubcommand.Options) {
		super(context, {
			...options,
			name: 'greeting',
			description: 'Greeting settings for guild'
		});
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((ctx) => {
			ctx.addSubcommandGroup((sc) => sc.setName('welcome').setDescription('Welcome greeting settings')).addSubcommandGroup((sc) =>
				sc.setName('leave').setDescription('Leave greeting settings')
			);

			this.hooks.groups(this, ctx);

			this.hooks.subcommands(this, ctx);

			return ctx.setName(this.name).setDescription(this.description);
		});
	}
}
