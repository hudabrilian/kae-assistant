import { StatusCode } from '#lib/types/enum';
import { generateEmbed } from '#lib/utils/embed';
import { getGreetingsByGuildId } from '#lib/utils/greeting';
import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener } from '@sapphire/framework';
import { GuildMember } from 'discord.js';

@ApplyOptions<Listener.Options>({
	event: Events.GuildMemberAdd
})
export class GuildListener extends Listener<typeof Events.GuildMemberAdd> {
	public async run(member: GuildMember): Promise<void> {
		const greeting = await getGreetingsByGuildId(member.guild.id);

		if (greeting.status !== StatusCode.SUCCESS) {
			this.container.logger.warn(greeting.message);
			return;
		}

		const welcomeChannel = member.guild.channels.cache.get(greeting.data!.welcomeChannel as string);

		if (!greeting.data!.enabled || !welcomeChannel!.isTextBased() || !greeting.data!.welcomeChannel || !greeting.data!.welcomeEmbed) return;

		const embed = await generateEmbed(greeting.data!.welcomeEmbed.id, member);

		if (embed.status !== StatusCode.SUCCESS) return this.container.logger.warn('Failed generate embed to send welcome greeting');

		await welcomeChannel.send({ embeds: [embed.data!] });
	}
}
