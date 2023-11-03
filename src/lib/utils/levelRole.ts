import { GuildLevelRole, Prisma } from '@prisma/client';
import { container } from '@sapphire/framework';

export async function addLevelRole(roleId: string, level: number, guildId: string): Promise<GuildLevelRole | null> {
	try {
		const guildLevel = await container.level.getLevelGuildByGuildId(guildId);

		if (!guildLevel) return null;

		const levelRole = await container.prisma.guildLevelRole.create({
			data: {
				role: roleId,
				level,
				guild: {
					connect: {
						id: guildLevel.id
					}
				}
			}
		});

		return levelRole;
	} catch (error) {
		container.logger.error(error);
		return null;
	}
}

export async function getLevelRole(guildId: string, roleId?: string, level?: number): Promise<GuildLevelRole | null> {
	try {
		const guildLevel = await container.level.getLevelGuildByGuildId(guildId);

		if (!guildLevel) return null;

		const where: Prisma.GuildLevelRoleWhereInput = {
			guild: {
				id: guildLevel.id
			}
		};

		if (roleId) {
			where.role = roleId;
		}

		if (level) {
			where.level = level;
		}

		return await container.prisma.guildLevelRole.findFirst({
			where: where
		});
	} catch (error) {
		container.logger.error(error);
		return null;
	}
}

export async function getLevelRoleByLevel(guildId: string, level: number): Promise<GuildLevelRole | null> {
	try {
		const guildLevel = await container.level.getLevelGuildByGuildId(guildId);

		if (!guildLevel) return null;

		return await container.prisma.guildLevelRole.findFirst({
			where: {
				guild: {
					id: guildLevel.id
				},
				level
			}
		});
	} catch (error) {
		container.logger.error(error);
		return null;
	}
}

export async function getLevelRoles(guildId: string): Promise<GuildLevelRole[]> {
	try {
		const guildLevel = await container.level.getLevelGuildByGuildId(guildId);

		if (!guildLevel) return [];

		return await container.prisma.guildLevelRole.findMany({
			where: {
				guild: {
					id: guildLevel.id
				}
			},
			orderBy: {
				level: 'asc'
			}
		});
	} catch (error) {
		container.logger.error(error);
		return [];
	}
}

export async function removeLevelRole(roleId: string, level: number, guildId: string): Promise<boolean> {
	try {
		const guildLevel = await container.level.getLevelGuildByGuildId(guildId);

		if (!guildLevel) return false;

		const guildLevelRole = await getLevelRole(guildId, roleId, level);

		if (!guildLevelRole) return false;

		await container.prisma.guildLevelRole.delete({
			where: {
				id: guildLevelRole.id
			}
		});

		return true;
	} catch (error) {
		container.logger.error(error);
		return false;
	}
}
