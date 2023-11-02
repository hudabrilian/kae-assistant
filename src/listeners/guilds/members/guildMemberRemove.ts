import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener } from '@sapphire/framework';
import { GuildMember } from 'discord.js';
import { generateEmbed } from '../../../lib/utils/embed';

@ApplyOptions<Listener.Options>({
	event: Events.GuildMemberRemove
})
export class GuildListener extends Listener<typeof Events.GuildMemberRemove> {
	public async run(member: GuildMember): Promise<void> {
		const greeting = await this.container.prisma.greeting.findFirst({
			where: {
				guild: {
					guildId: member.guild.id
				}
			},
			select: {
				enabled: true,
				leaveChannel: true,
				leaveEmbed: true
			}
		});

		if (!greeting) return;

		const leaveChannel = member.guild.channels.cache.get(greeting.leaveChannel as string);

		if (!greeting.enabled || !leaveChannel!.isTextBased() || !greeting.leaveChannel || !greeting.leaveEmbed) return;

		const embed = await generateEmbed(greeting.leaveEmbed.id, member);

		if (!embed) return this.container.logger.warn('Failed generate embed to send leave greeting');

		await leaveChannel.send({ embeds: [embed] });
	}
}
