import { StatusCode, LevelEvents } from '#lib/types/enum';
import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener } from '@sapphire/framework';
import { Message } from 'discord.js';

@ApplyOptions<Listener.Options>({
	event: Events.MessageCreate,
	once: false
})
export class LevelsListener extends Listener<typeof Events.MessageCreate> {
	public async run(message: Message): Promise<void> {
		if (message.author.bot) return;

		const levelGuild = await this.container.level.getLevelGuildByGuildId(message.guildId!);

		if (levelGuild.status !== StatusCode.SUCCESS) return;

		const userLevel = await this.container.level.getUserLevel(message.author.id, message.guildId!);

		if (userLevel.status !== StatusCode.SUCCESS) {
			this.container.level.createUserLevel(message.author.id, message.guildId!);
			return;
		}

		const isLevelUp = await this.container.level.checkLevelUp(message.author.id, message.guildId!);

		if (isLevelUp) {
			await this.container.level.addLevelUser(message.author.id, message.guildId!, 1, false);

			this.container.client.emit(LevelEvents.LEVEL_UP, message, {
				user: userLevel,
				level: userLevel.data!.level + 1
			});
			return;
		}

		await this.container.level.addXpUser(message.author.id, message.guildId!);
	}
}
