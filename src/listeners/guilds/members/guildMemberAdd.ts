import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener } from '@sapphire/framework';
import { GuildMember } from 'discord.js';
import { generateEmbed } from '../../../lib/utils/embed';

@ApplyOptions<Listener.Options>({
	event: Events.GuildMemberAdd
})
export class GuildListener extends Listener<typeof Events.GuildMemberAdd> {
	public async run(member: GuildMember): Promise<void> {
		const greeting = await this.container.prisma.greeting.findFirst({
			where: {
				guild: {
					guildId: member.guild.id
				}
			},
			select: {
				enabled: true,
				welcomeChannel: true,
				welcomeEmbed: true
			}
		});

		if (!greeting) return;

		const welcomeChannel = member.guild.channels.cache.get(greeting.welcomeChannel as string);

		if (!greeting.enabled || !welcomeChannel!.isTextBased() || !greeting.welcomeChannel || !greeting.welcomeEmbed) return;

		const embed = await generateEmbed(greeting.welcomeEmbed.id, member);

		if (!embed) return this.container.logger.warn('Failed generate embed to send welcome greeting');

		await welcomeChannel.send({ embeds: [embed] });
	}
}
