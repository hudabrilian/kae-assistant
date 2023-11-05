import KaeEmbed from '#lib/structures/embeds/KaeEmbed';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, container } from '@sapphire/framework';
import { GuildQueue, Track } from 'discord-player';
import { Colors, CommandInteraction } from 'discord.js';

@ApplyOptions<Listener.Options>({
	emitter: container.player.events,
	event: 'audioTracksAdd'
})
export class PlayerTracksAddListener extends Listener {
	public async run(queue: GuildQueue<CommandInteraction>, tracks: Track[]): Promise<any> {
		return queue.metadata!.followUp({
			embeds: [
				new KaeEmbed()
					.setColor(Colors.Blue)
					.setTitle('Added to queue')
					.setDescription(tracks.map((track) => `[${track.title}](${track.url})`).join('\n'))
			]
		});
	}
}
