import { UserLevel } from '@prisma/client';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { GuildMember, Message, roleMention } from 'discord.js';
import { LevelEvents, StatusCode } from '../../lib/types/enum';
import { getLevelRoleByLevel } from '../../lib/utils/levelRole';

@ApplyOptions<Listener.Options>({
	event: LevelEvents.LEVEL_UP
})
export class LevelsListener extends Listener<typeof LevelEvents.LEVEL_UP> {
	public async run(message: Message, { user, level }: { user: UserLevel; level: number }): Promise<void> {
		this.container.logger.debug(`[KaeLevel] User ${user.id} reached level ${level}`);

		const member = message.member as GuildMember;
		const levelRoleGuild = await getLevelRoleByLevel(message.guildId!, level);

		if (levelRoleGuild.status === StatusCode.NOT_FOUND) {
			await message.channel.send({
				content: `Congratulations ${message.member}, you reached level ${level}!`
			});
			return;
		}

		if (levelRoleGuild.status !== StatusCode.SUCCESS) return;

		const guildRole = message.guild!.roles.cache.find((role) => role.id === levelRoleGuild.data!.role);

		if (!guildRole) return;

		if (member.roles.cache.some((role) => role.id === levelRoleGuild.data!.role)) {
			await message.channel.send({
				content: `Congratulations ${message.member}, you reached level ${level}!`
			});
			return;
		}

		await member.roles.add(guildRole);

		await message.channel.send({
			content: `Congratulations ${message.member}, you reached level ${level} and you got ${roleMention(guildRole.id)}!`
		});
	}
}
