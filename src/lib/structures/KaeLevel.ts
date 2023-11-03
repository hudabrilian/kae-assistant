import { GuildLevel, Prisma, UserLevel } from '@prisma/client';
import { type Container } from '@sapphire/pieces';
import { LevelEvents } from '../types/enum';
import { container as c } from '@sapphire/framework';

export class KaeLevel {
	private baseXp: number = 100;
	private container: Container;

	public constructor() {
		this.container = c;
	}

	public async getLevelGuildByGuildId(guildId: string): Promise<GuildLevel | null> {
		try {
			return await this.container.prisma.guildLevel.findFirst({
				where: {
					guild: {
						guildId
					}
				}
			});
		} catch (error) {
			this.container.logger.error(error);
			return null;
		}
	}

	public async setLevelGuild(guildId: string, status: boolean): Promise<void> {
		try {
			const levelGuild = await this.getLevelGuildByGuildId(guildId);

			if (levelGuild) {
				await this.container.prisma.guildLevel.update({
					where: {
						id: levelGuild.id
					},
					data: {
						status
					}
				});
				return;
			}

			await this.container.prisma.guildLevel.create({
				data: {
					guild: {
						connect: {
							guildId
						}
					},
					status
				}
			});
		} catch (error) {
			this.container.logger.error(error);
		}
	}

	public async getUserLevel(userId: string, guildId: string): Promise<UserLevel | null> {
		try {
			return await this.container.prisma.userLevel.findFirst({
				where: {
					AND: {
						user: {
							userId
						},
						guild: {
							guildId
						}
					}
				}
			});
		} catch (error) {
			this.container.logger.error(error);
			return null;
		}
	}

	public async createUserLevel(userId: string, guildId: string): Promise<UserLevel | null> {
		try {
			return await this.container.prisma.userLevel.create({
				data: {
					user: {
						connect: {
							userId
						}
					},
					guild: {
						connect: {
							guildId
						}
					},
					xp: 0,
					level: 1
				}
			});
		} catch (error) {
			this.container.logger.error(error);
			return null;
		}
	}

	public async calculateXpLevel(nextLevel: number): Promise<number> {
		return this.baseXp * nextLevel ** 2 - this.baseXp * nextLevel;
	}

	public async checkLevelUp(userId: string, guildId: string): Promise<boolean> {
		const userLevel = await this.getUserLevel(userId, guildId);

		if (!userLevel) return false;

		const xpNextLevel = await this.calculateXpLevel(userLevel.level + 1);

		return userLevel.xp >= xpNextLevel;
	}

	public async addXpUser(userId: string, guildId: string, xp?: number) {
		const userLevel = await this.getUserLevel(userId, guildId);

		if (!userLevel) return;

		const xpGain = xp ?? Math.floor(Math.random() * 10) + 1;

		await this.container.prisma.userLevel.update({
			where: {
				id: userLevel.id
			},
			data: {
				xp: {
					increment: xpGain
				}
			}
		});

		this.container.client.emit(LevelEvents.ADD_XP, {
			user: userLevel,
			xp: xpGain
		});
	}

	public async setXpUser(userId: string, guildId: string, xp: number): Promise<void> {
		const userLevel = await this.getUserLevel(userId, guildId);

		if (!userLevel || xp <= 0) return;

		await this.container.prisma.userLevel.update({
			where: {
				id: userLevel.id
			},
			data: {
				xp: {
					set: xp
				}
			}
		});

		this.container.client.emit(LevelEvents.SET_XP, {
			user: userLevel,
			xp
		});
	}

	public async subtractXpUser(userId: string, guildId: string, xp: number): Promise<void> {
		const userLevel = await this.getUserLevel(userId, guildId);

		if (!userLevel || xp <= 0) return;

		await this.container.prisma.userLevel.update({
			where: {
				id: userLevel.id
			},
			data: {
				xp: {
					decrement: xp
				}
			}
		});

		this.container.client.emit(LevelEvents.SUBTRACT_XP, {
			user: userLevel,
			xp
		});
	}

	public async setLevelUser(userId: string, guildId: string, level: number): Promise<void> {
		const userLevel = await this.getUserLevel(userId, guildId);

		if (!userLevel || level <= 0) return;

		await this.container.prisma.userLevel.update({
			where: {
				id: userLevel.id
			},
			data: {
				level: {
					set: level
				}
			}
		});

		this.container.client.emit(LevelEvents.SET_LEVEL, {
			user: userLevel,
			level
		});
	}

	public async addLevelUser(userId: string, guildId: string, level?: number, xp: boolean = true): Promise<void> {
		const userLevel = await this.getUserLevel(userId, guildId);

		if (!userLevel) return;

		if (!level) level = 1;

		await this.container.prisma.userLevel.update({
			where: {
				id: userLevel.id
			},
			data: {
				xp: {
					increment: xp ? level * 100 : 0
				},
				level: {
					increment: level
				}
			}
		});

		this.container.client.emit(LevelEvents.ADD_LEVEL, {
			user: userLevel,
			level
		});
	}

	public async subtractLevelUser(userId: string, guildId: string, level: number): Promise<void> {
		const userLevel = await this.getUserLevel(userId, guildId);

		if (!userLevel || level < 1) return;

		await this.container.prisma.userLevel.update({
			where: {
				id: userLevel.id
			},
			data: {
				xp: {
					increment: level * 100
				},
				level: {
					decrement: level
				}
			}
		});

		this.container.client.emit(LevelEvents.SUBTRACT_LEVEL, {
			user: userLevel,
			level
		});
	}

	public async getLeaderboard(
		guildId: string,
		limit: number = 10
	): Promise<
		Prisma.UserLevelGetPayload<{
			include: {
				user: true;
			};
		}>[]
	> {
		try {
			return await this.container.prisma.userLevel.findMany({
				where: {
					guild: {
						guildId
					}
				},
				include: {
					user: true
				},
				orderBy: {
					xp: 'desc'
				},
				take: limit
			});
		} catch (error) {
			this.container.logger.error(error);
			return [];
		}
	}
}
