import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener } from '@sapphire/framework';
import { Message } from 'discord.js';
import { LevelEvents } from '../../lib/types/enum';

@ApplyOptions<Listener.Options>({
	event: Events.MessageCreate,
	once: false
})
export class LevelsListener extends Listener<typeof Events.MessageCreate> {
	public async run(message: Message): Promise<void> {
		if (message.author.bot) return;

		const levelGuild = await this.container.level.getLevelGuildByGuildId(message.guildId!);

		if (!levelGuild) return;

		const userLevel = await this.container.level.getUserLevel(message.author.id, message.guildId!);

		if (!userLevel) {
			this.container.level.createUserLevel(message.author.id, message.guildId!);
			return;
		}

		const isLevelUp = await this.container.level.checkLevelUp(message.author.id, message.guildId!);

		if (isLevelUp) {
			await this.container.level.addLevelUser(message.author.id, message.guildId!, 1, false);

			this.container.client.emit(LevelEvents.LEVEL_UP, message, {
				user: userLevel,
				level: userLevel.level + 1
			});
			return;
		}

		await this.container.level.addXpUser(message.author.id, message.guildId!);
	}
}
