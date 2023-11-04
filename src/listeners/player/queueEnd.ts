import { ApplyOptions } from '@sapphire/decorators';
import { Listener, container } from '@sapphire/framework';
import { GuildQueue, Util } from 'discord-player';

@ApplyOptions<Listener.Options>({
	emitter: container.player.events,
	event: 'emptyQueue'
})
export class PlayerQueueEndListener extends Listener {
	public run(queue: GuildQueue): void {
		if (!queue.channel || Util.isVoiceEmpty(queue.channel)) {
			queue.delete();
			this.container.logger.debug(`[${queue.guild.name}] Queue finished!`);
		}
	}
}
