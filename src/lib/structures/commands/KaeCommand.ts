import { Command, Subcommand } from '@kaname-png/plugin-subcommands-advanced';
import { UserError } from '@sapphire/framework';
import { TOptions, Target } from '@sapphire/plugin-i18next';
import { resolveMaybeKey } from '../../utils';

export abstract class KaeCommand extends Command {
	public constructor(context: Command.Context, options: KaeCommand.Options) {
		super(context, options);
	}

	protected resolveCommandKey(target: Target, key: string, options?: TOptions) {
		return resolveMaybeKey(target, `commands/${this.name}:${key}`, options);
	}
}

export abstract class KaeSubcommand extends Subcommand {
	public constructor(context: Subcommand.Context, options: KaeCommand.Options) {
		super(context, options);
	}

	protected error(identifier: string | UserError, context?: unknown): never {
		throw typeof identifier === 'string' ? new UserError({ identifier, context }) : identifier;
	}

	protected resolveSubCommandKey(target: Target, key: string, options?: TOptions) {
		return resolveMaybeKey(target, `subcommands/${this.name}:${key}`, options);
	}
}

export namespace KaeCommand {
	export type AutocompleteInteraction = Command.AutocompleteInteraction;
	export type ChatInputCommandInteraction = Command.ChatInputInteraction;
	export type Context = Command.Context;
	export type ContextMenuCommandInteraction = Command.ContextMenuInteraction;
	export type JSON = Command.JSON;
	export type Options = Command.Options;
	export type Registry = Command.Registry;
	export type RunInTypes = Command.RunInTypes;
}

export namespace KaeSubcommand {
	export type AutocompleteInteraction = Subcommand.AutocompleteInteraction;
	export type ChatInputCommandInteraction = Subcommand.ChatInputInteraction;
	export type Context = Subcommand.Context;
	export type ContextMenuCommandInteraction = Subcommand.ContextMenuInteraction;
	export type JSON = Subcommand.JSON;
	export type Options = Subcommand.Options;
	export type Registry = Subcommand.Registry;
	export type RunInTypes = Subcommand.RunInTypes;
}
