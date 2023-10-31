import { AsyncPreconditionResult, Precondition } from '@sapphire/framework';
import { OWNERS } from '../config';
import { Message } from 'discord.js';

export class UserPrecondition extends Precondition {
	public async run(message: Message): AsyncPreconditionResult {
		return OWNERS.includes(message.author.id) ? this.ok() : this.error({ context: { silent: true } });
	}
}
