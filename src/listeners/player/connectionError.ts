import { ApplyOptions } from '@sapphire/decorators';
import { Listener, container } from '@sapphire/framework';
import { GuildQueue } from 'discord-player';

@ApplyOptions<Listener.Options>({
	emitter: container.player.events,
	event: 'playerError'
})
export class PlayerConnectionErrorListener extends Listener {
	public run(queue: GuildQueue, error: Error): void {
		this.container.logger.debug(`[${queue.guild.name}] Error from the connection`, error);
	}
}
