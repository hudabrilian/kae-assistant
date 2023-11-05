import { KaeSubcommand } from '#lib/structures/commands/KaeCommand';
import { ApplicationCommandRegistry } from '@sapphire/framework';

export class ParentCommand extends KaeSubcommand {
	public constructor(context: KaeSubcommand.Context, options: KaeSubcommand.Options) {
		super(context, {
			...options,
			name: 'level',
			description: 'Leveling system'
		});
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((ctx) => {
			ctx.addSubcommandGroup((sc) => sc.setName('role').setDescription('Role level settings'));

			this.hooks.groups(this, ctx);
			this.hooks.subcommands(this, ctx);

			return ctx.setName(this.name).setDescription(this.description);
		});
	}
}
