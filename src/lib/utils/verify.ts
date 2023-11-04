import { GuildVerify } from '@prisma/client';
import { container } from '@sapphire/framework';
import { StatusCode } from '../types/enum';
import { Status } from '../types/types';

export async function getVerifyByGuildId(guildId: string): Promise<Status<GuildVerify | null>> {
	try {
		const guildVerify = await container.prisma.guildVerify.findFirst({
			where: {
				guild: {
					guildId
				}
			}
		});

		if (!guildVerify) return { status: StatusCode.NOT_FOUND, message: 'Guild verify setting not found' };

		return {
			status: StatusCode.SUCCESS,
			data: guildVerify
		};
	} catch (error) {
		container.logger.error(error);
		return {
			status: StatusCode.ERROR,
			message: 'Something went wrong'
		};
	}
}

export async function setVerify(guildId: string, roleId: string): Promise<Status<GuildVerify | null>> {
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

		return {
			status: StatusCode.SUCCESS,
			data: guildVerify
		};
	} catch (error) {
		container.logger.error(error);
		return {
			status: StatusCode.ERROR,
			message: 'Something went wrong'
		};
	}
}
