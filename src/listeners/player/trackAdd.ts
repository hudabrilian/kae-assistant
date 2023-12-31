import KaeEmbed from '#lib/structures/embeds/KaeEmbed';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, container } from '@sapphire/framework';
import { GuildQueue, Track } from 'discord-player';
import { Colors, CommandInteraction } from 'discord.js';

@ApplyOptions<Listener.Options>({
	emitter: container.player.events,
	event: 'audioTrackAdd'
})
export class PlayerTrackAddListener extends Listener {
	public async run(queue: GuildQueue<CommandInteraction>, track: Track): Promise<any> {
		if (queue.currentTrack === track) return;
		return queue.metadata!.followUp({
			embeds: [new KaeEmbed().setColor(Colors.Blue).setTitle('Added to queue').setDescription(`[${track.title}](${track.url})`)]
		});
	}
}
