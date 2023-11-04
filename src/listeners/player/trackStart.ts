import { ApplyOptions } from '@sapphire/decorators';
import { Listener, container } from '@sapphire/framework';
import { GuildQueue, Track } from 'discord-player';
import { CommandInteraction } from 'discord.js';
import KaeEmbed from '../../lib/structures/embeds/KaeEmbed';

@ApplyOptions<Listener.Options>({
	emitter: container.player.events,
	event: 'playerStart'
})
export class PlayerTrackStartListener extends Listener {
	public async run(queue: GuildQueue<CommandInteraction>, track: Track): Promise<any> {
		return queue.metadata!.followUp({
			embeds: [new KaeEmbed().setTitle('Now playing').setDescription(`[${track.title}](${track.url})`)]
		});
	}
}
