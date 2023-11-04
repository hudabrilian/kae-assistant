import { ApplyOptions } from '@sapphire/decorators';
import { Listener, container } from '@sapphire/framework';
import { GuildQueue } from 'discord-player';

@ApplyOptions<Listener.Options>({
	emitter: container.player.events,
	name: 'playerDebug',
	event: 'debug'
})
export class PlayerDebugListener extends Listener {
	public run(queue: GuildQueue, message: string): void {
		this.container.logger.debug(`[${queue.guild.name}] ${message}`);
	}
}
