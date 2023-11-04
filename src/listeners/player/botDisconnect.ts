import { ApplyOptions } from '@sapphire/decorators';
import { Listener, container } from '@sapphire/framework';
import { GuildQueue } from 'discord-player';

@ApplyOptions<Listener.Options>({
	emitter: container.player.events,
	event: 'disconnect'
})
export class PlayerBotDisconnectListener extends Listener {
	public run(queue: GuildQueue): void {
		this.container.logger.debug(`[${queue.guild.name}] Got disconnected from guild, now clearing queue!`);
	}
}
