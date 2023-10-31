import {
	container,
	type ChatInputCommandSuccessPayload,
	type Command,
	type ContextMenuCommandSuccessPayload,
	type MessageCommandSuccessPayload
} from '@sapphire/framework';
import { TOptions, Target, resolveKey } from '@sapphire/plugin-i18next';
import { cyan } from 'colorette';
import type { APIUser, Guild, User } from 'discord.js';

export function logSuccessCommand(payload: ContextMenuCommandSuccessPayload | ChatInputCommandSuccessPayload | MessageCommandSuccessPayload): void {
	let successLoggerData: ReturnType<typeof getSuccessLoggerData>;

	if ('interaction' in payload) {
		successLoggerData = getSuccessLoggerData(payload.interaction.guild, payload.interaction.user, payload.command);
	} else {
		successLoggerData = getSuccessLoggerData(payload.message.guild, payload.message.author, payload.command);
	}

	container.logger.debug(`${successLoggerData.shard} - ${successLoggerData.commandName} ${successLoggerData.author} ${successLoggerData.sentAt}`);
}

export function getSuccessLoggerData(guild: Guild | null, user: User, command: Command) {
	const shard = getShardInfo(guild?.shardId ?? 0);
	const commandName = getCommandInfo(command);
	const author = getAuthorInfo(user);
	const sentAt = getGuildInfo(guild);

	return { shard, commandName, author, sentAt };
}

export function resolveMaybeKey(target: Target, key: string, options?: TOptions): Promise<string> {
	return resolveKey(target, key, {
		...options,
		defaultValue: key
	});
}

export function getEnumValueFromStringValue(str: string, enumType: any): any | undefined {
	for (const key in enumType) {
		if (enumType[key] === str) {
			return enumType[key];
		}
	}
	return undefined; // Handle the case where the string doesn't match any enum value
}

export function mapEnumToChoices(enumType: any): { name: string; value: string }[] {
	const choices = [];
	for (const key in enumType) {
		if (enumType.hasOwnProperty(key)) {
			const value = enumType[key];
			choices.push({ name: value, value: key });
		}
	}
	return choices;
}

function getShardInfo(id: number) {
	return `[${cyan(id.toString())}]`;
}

function getCommandInfo(command: Command) {
	return cyan(command.name);
}

function getAuthorInfo(author: User | APIUser) {
	return `${author.username}[${cyan(author.id)}]`;
}

function getGuildInfo(guild: Guild | null) {
	if (guild === null) return 'Direct Messages';
	return `${guild.name}[${cyan(guild.id)}]`;
}
