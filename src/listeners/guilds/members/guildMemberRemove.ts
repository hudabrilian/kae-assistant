import { StatusCode } from '#lib/types/enum';
import { generateEmbed } from '#lib/utils/embed';
import { getGreetingsByGuildId } from '#lib/utils/greeting';
import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener } from '@sapphire/framework';
import { GuildMember } from 'discord.js';

@ApplyOptions<Listener.Options>({
	event: Events.GuildMemberRemove
})
export class GuildListener extends Listener<typeof Events.GuildMemberRemove> {
	public async run(member: GuildMember): Promise<void> {
		const greeting = await getGreetingsByGuildId(member.guild.id);

		if (greeting.status !== StatusCode.SUCCESS) {
			this.container.logger.warn(greeting.message);
			return;
		}

		const leaveChannel = member.guild.channels.cache.get(greeting.data!.leaveChannel as string);

		if (!greeting.data!.enabled || !leaveChannel!.isTextBased() || !greeting.data!.leaveChannel || !greeting.data!.leaveEmbed) return;

		const embed = await generateEmbed(greeting.data!.leaveEmbed.id, member);

		if (embed.status !== StatusCode.SUCCESS) return this.container.logger.warn('Failed generate embed to send leave greeting');

		await leaveChannel.send({ embeds: [embed.data!] });
	}
}
