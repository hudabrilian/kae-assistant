import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener, ListenerOptions } from '@sapphire/framework';
import { bold, gray } from 'colorette';
import { Guild } from 'discord.js';

@ApplyOptions<ListenerOptions>({ event: Events.GuildCreate })
export class GuildCreateListener extends Listener {
	public async run(guild: Guild) {
		if (!guild.available) return;
		this.container.logger.info(`Joined guild: ${bold(guild.name)} (${gray(guild.id)})`);
	}
}
