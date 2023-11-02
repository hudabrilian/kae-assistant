import { GuildVerify } from '@prisma/client';
import { container } from '@sapphire/framework';

export async function getVerifyByGuildId(guildId: string): Promise<GuildVerify | null> {
	try {
		const guildVerify = await container.prisma.guildVerify.findFirst({
			where: {
				guild: {
					guildId
				}
			}
		});
		return guildVerify;
	} catch (error) {
		container.logger.error(error);
		return null;
	}
}

export async function setVerify(guildId: string, roleId: string): Promise<GuildVerify | null> {
	try {
		const guildVerify = await container.prisma.guildVerify.upsert({
			where: {
				guildId
			},
			create: {
				guildId,
				role: roleId
			},
			update: {
				role: roleId
			}
		});

		return guildVerify;
	} catch (error) {
		container.logger.error(error);
		return null;
	}
}
