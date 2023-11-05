import { StatusCode } from '#lib/types/enum';
import { Status } from '#lib/types/types';
import { GuildLevelRole, Prisma } from '@prisma/client';
import { container } from '@sapphire/framework';

export async function addLevelRole(roleId: string, level: number, guildId: string): Promise<Status<GuildLevelRole>> {
	try {
		const guildLevel = await container.level.getLevelGuildByGuildId(guildId);

		if (guildLevel.status !== StatusCode.SUCCESS) return guildLevel;

		const levelRole = await container.prisma.guildLevelRole.create({
			data: {
				role: roleId,
				level,
				guild: {
					connect: {
						id: guildLevel.data!.id
					}
				}
			}
		});

		return {
			status: StatusCode.SUCCESS,
			data: levelRole
		};
	} catch (error) {
		container.logger.error(error);
		return {
			status: StatusCode.ERROR,
			message: 'Something went wrong'
		};
	}
}

export async function getLevelRole(guildId: string, roleId?: string, level?: number): Promise<Status<GuildLevelRole>> {
	try {
		const guildLevel = await container.level.getLevelGuildByGuildId(guildId);

		if (guildLevel.status !== StatusCode.SUCCESS) return guildLevel;

		const where: Prisma.GuildLevelRoleWhereInput = {
			guild: {
				id: guildLevel.data!.id
			}
		};

		if (roleId) {
			where.role = roleId;
		}

		if (level) {
			where.level = level;
		}

		const guildLevelRole = await container.prisma.guildLevelRole.findFirst({
			where: where
		});

		if (!guildLevelRole)
			return {
				status: StatusCode.NOT_FOUND,
				message: 'Guild level role not found'
			};

		return {
			status: StatusCode.SUCCESS,
			data: guildLevelRole
		};
	} catch (error) {
		container.logger.error(error);
		return {
			status: StatusCode.ERROR,
			message: 'Something went wrong'
		};
	}
}

export async function getLevelRoleByLevel(guildId: string, level: number): Promise<Status<GuildLevelRole>> {
	try {
		const guildLevel = await container.level.getLevelGuildByGuildId(guildId);

		if (guildLevel.status !== StatusCode.SUCCESS) return guildLevel;

		const guildLevelRole = await container.prisma.guildLevelRole.findFirst({
			where: {
				guild: {
					id: guildLevel.data!.id
				},
				level
			}
		});

		if (!guildLevelRole)
			return {
				status: StatusCode.NOT_FOUND,
				message: 'Guild Level role not found'
			};

		return {
			status: StatusCode.SUCCESS,
			data: guildLevelRole
		};
	} catch (error) {
		container.logger.error(error);
		return {
			status: StatusCode.ERROR,
			message: 'Something went wrong'
		};
	}
}

export async function getLevelRoles(guildId: string): Promise<Status<GuildLevelRole[]>> {
	try {
		const guildLevel = await container.level.getLevelGuildByGuildId(guildId);

		if (guildLevel.status !== StatusCode.SUCCESS) return guildLevel;

		const guildLevelRoles = await container.prisma.guildLevelRole.findMany({
			where: {
				guild: {
					id: guildLevel.data!.id
				}
			},
			orderBy: {
				level: 'asc'
			}
		});

		return {
			status: StatusCode.SUCCESS,
			data: guildLevelRoles
		};
	} catch (error) {
		container.logger.error(error);
		return {
			status: StatusCode.ERROR,
			message: 'Something went wrong'
		};
	}
}

export async function removeLevelRole(roleId: string, level: number, guildId: string): Promise<Status> {
	try {
		const guildLevel = await container.level.getLevelGuildByGuildId(guildId);

		if (guildLevel.status !== StatusCode.SUCCESS) return guildLevel;

		const guildLevelRole = await getLevelRole(guildId, roleId, level);

		if (guildLevelRole.status !== StatusCode.SUCCESS) return guildLevelRole;

		await container.prisma.guildLevelRole.delete({
			where: {
				id: guildLevelRole.data!.id
			}
		});

		return {
			status: StatusCode.SUCCESS
		};
	} catch (error) {
		container.logger.error(error);
		return {
			status: StatusCode.ERROR,
			message: 'Something went wrong'
		};
	}
}
