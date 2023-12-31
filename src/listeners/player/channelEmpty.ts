import { ApplyOptions } from '@sapphire/decorators';
import { Listener, container } from '@sapphire/framework';
import { GuildQueue } from 'discord-player';

@ApplyOptions<Listener.Options>({
	emitter: container.player.events,
	event: 'emptyChannel'
})
export class PlayerChannelEmptyListener extends Listener {
	public run(queue: GuildQueue): void {
		if (!queue.currentTrack) {
			queue.delete();
			this.container.logger.debug(`[${queue.guild.name}] Voice channel empty, now leaving...`);
		}
	}
}
