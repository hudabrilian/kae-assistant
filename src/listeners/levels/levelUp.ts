import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { LevelEvents } from '../../lib/types/enum';
import { UserLevel } from '@prisma/client';
import { Message } from 'discord.js';

@ApplyOptions<Listener.Options>({
	event: LevelEvents.LEVEL_UP
})
export class LevelsListener extends Listener<typeof LevelEvents.LEVEL_UP> {
	public async run(message: Message, { user, level }: { user: UserLevel; level: number }): Promise<void> {
		this.container.logger.debug(`[KaeLevel] User ${user.id} reached level ${level}`);

		await message.channel.send({
			content: `Congratulations ${message.author}, you reached level ${level}!`
		});
	}
}
