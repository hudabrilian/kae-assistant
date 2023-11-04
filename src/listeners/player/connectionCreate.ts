import { ApplyOptions } from '@sapphire/decorators';
import { Listener, container } from '@sapphire/framework';
import { GuildQueue, StreamDispatcher } from 'discord-player';

@ApplyOptions<Listener.Options>({
	emitter: container.player.events,
	event: 'connection'
})
export class PlayerConnectionCreateListener extends Listener {
	public run(queue: GuildQueue, connection: StreamDispatcher): void {
		this.container.logger.debug(`[${queue.guild.name}] Now connected to 🔊 ${connection.channel.name}`);
	}
}
