import { GuildLevel, Prisma, UserLevel } from '@prisma/client';
import { container as c } from '@sapphire/framework';
import { type Container } from '@sapphire/pieces';
import { LevelEvents, StatusCode } from '../types/enum';
import { Status } from '../types/types';

export class KaeLevel {
	private baseXp: number = 100;
	private container: Container;

	public constructor() {
		this.container = c;
	}

	public async getLevelGuildByGuildId(guildId: string): Promise<Status<GuildLevel>> {
		try {
			const guildLevel = await this.container.prisma.guildLevel.findFirst({
				where: {
					guild: {
						guildId
					}
				}
			});

			if (!guildLevel)
				return {
					status: StatusCode.NOT_FOUND,
					message: 'Guild level not found'
				};

			return {
				status: StatusCode.SUCCESS,
				data: guildLevel
			};
		} catch (error) {
			this.container.logger.error(error);
			return {
				status: StatusCode.ERROR,
				message: 'Something went wrong'
			};
		}
	}

	public async setLevelGuild(guildId: string, status: boolean): Promise<Status> {
		try {
			const levelGuild = await this.getLevelGuildByGuildId(guildId);

			if (levelGuild.status === StatusCode.NOT_FOUND) {
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

				return {
					status: StatusCode.SUCCESS,
					message: 'Successfully update guild level settings'
				};
			}

			if (levelGuild.status !== StatusCode.SUCCESS) return levelGuild;

			await this.container.prisma.guildLevel.update({
				where: {
					id: levelGuild.data!.id
				},
				data: {
					status
				}
			});

			return {
				status: StatusCode.SUCCESS,
				message: 'Successfully update guild level settings'
			};
		} catch (error) {
			this.container.logger.error(error);
			return {
				status: StatusCode.ERROR,
				message: 'Something went wrong'
			};
		}
	}

	public async getUserLevel(userId: string, guildId: string): Promise<Status<UserLevel>> {
		try {
			const userLevel = await this.container.prisma.userLevel.findFirst({
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

			if (!userLevel)
				return {
					status: StatusCode.NOT_FOUND,
					message: 'User level not found'
				};

			return {
				status: StatusCode.SUCCESS,
				data: userLevel
			};
		} catch (error) {
			this.container.logger.error(error);
			return {
				status: StatusCode.ERROR,
				message: 'Something went wrong'
			};
		}
	}

	public async createUserLevel(userId: string, guildId: string): Promise<Status<UserLevel>> {
		try {
			const userLevel = await this.container.prisma.userLevel.create({
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

			return {
				status: StatusCode.SUCCESS,
				data: userLevel
			};
		} catch (error) {
			this.container.logger.error(error);
			return {
				status: StatusCode.ERROR,
				message: 'Something went wrong'
			};
		}
	}

	public async calculateXpLevel(nextLevel: number): Promise<number> {
		return this.baseXp * nextLevel ** 2 - this.baseXp * nextLevel;
	}

	public async checkLevelUp(userId: string, guildId: string): Promise<boolean> {
		const userLevel = await this.getUserLevel(userId, guildId);

		if (userLevel.status !== StatusCode.SUCCESS) return false;

		const xpNextLevel = await this.calculateXpLevel(userLevel.data!.level + 1);

		return userLevel.data!.xp >= xpNextLevel;
	}

	public async addXpUser(userId: string, guildId: string, xp?: number): Promise<Status> {
		try {
			const userLevel = await this.getUserLevel(userId, guildId);

			if (userLevel.status !== StatusCode.SUCCESS) return userLevel;

			const xpGain = xp ?? Math.floor(Math.random() * 10) + 1;

			await this.container.prisma.userLevel.update({
				where: {
					id: userLevel.data!.id
				},
				data: {
					xp: {
						increment: xpGain
					}
				}
			});

			this.container.client.emit(LevelEvents.ADD_XP, {
				user: userLevel.data,
				xp: xpGain
			});

			return {
				status: StatusCode.SUCCESS
			};
		} catch (error) {
			this.container.logger.error(error);
			return {
				status: StatusCode.ERROR,
				message: 'Something went wrong'
			};
		}
	}

	public async setXpUser(userId: string, guildId: string, xp: number): Promise<Status> {
		try {
			const userLevel = await this.getUserLevel(userId, guildId);

			if (userLevel.status !== StatusCode.SUCCESS) return userLevel;

			if (xp <= 0)
				return {
					status: StatusCode.ERROR,
					message: 'Xp must greater than or equals 1'
				};

			await this.container.prisma.userLevel.update({
				where: {
					id: userLevel.data!.id
				},
				data: {
					xp: {
						set: xp
					}
				}
			});

			this.container.client.emit(LevelEvents.SET_XP, {
				user: userLevel.data,
				xp
			});

			return {
				status: StatusCode.SUCCESS
			};
		} catch (error) {
			this.container.logger.error(error);
			return {
				status: StatusCode.ERROR,
				message: 'Something went wrong'
			};
		}
	}

	public async subtractXpUser(userId: string, guildId: string, xp: number): Promise<Status> {
		try {
			const userLevel = await this.getUserLevel(userId, guildId);

			if (userLevel.status !== StatusCode.SUCCESS) return userLevel;

			if (xp <= 0)
				return {
					status: StatusCode.ERROR,
					message: 'Xp must greater than or equals 1'
				};

			await this.container.prisma.userLevel.update({
				where: {
					id: userLevel.data!.id
				},
				data: {
					xp: {
						decrement: xp
					}
				}
			});

			this.container.client.emit(LevelEvents.SUBTRACT_XP, {
				user: userLevel.data,
				xp
			});

			return {
				status: StatusCode.SUCCESS
			};
		} catch (error) {
			this.container.logger.error(error);
			return {
				status: StatusCode.ERROR,
				message: 'Something went wrong'
			};
		}
	}

	public async setLevelUser(userId: string, guildId: string, level: number): Promise<Status> {
		try {
			const userLevel = await this.getUserLevel(userId, guildId);

			if (userLevel.status !== StatusCode.SUCCESS) return userLevel;

			if (level <= 0)
				return {
					status: StatusCode.ERROR,
					message: 'Level must greater than or equals 1'
				};

			await this.container.prisma.userLevel.update({
				where: {
					id: userLevel.data!.id
				},
				data: {
					level: {
						set: level
					}
				}
			});

			this.container.client.emit(LevelEvents.SET_LEVEL, {
				user: userLevel.data,
				level
			});

			return {
				status: StatusCode.SUCCESS
			};
		} catch (error) {
			this.container.logger.error(error);
			return {
				status: StatusCode.ERROR,
				message: 'Something went wrong'
			};
		}
	}

	public async addLevelUser(userId: string, guildId: string, level?: number, xp: boolean = true): Promise<Status> {
		try {
			const userLevel = await this.getUserLevel(userId, guildId);

			if (userLevel.status !== StatusCode.SUCCESS) return userLevel;

			if (!level) level = 1;

			if (level <= 0)
				return {
					status: StatusCode.ERROR,
					message: 'Level must greater than or equals 1'
				};

			await this.container.prisma.userLevel.update({
				where: {
					id: userLevel.data!.id
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
				user: userLevel.data,
				level
			});

			return {
				status: StatusCode.SUCCESS
			};
		} catch (error) {
			this.container.logger.error(error);
			return {
				status: StatusCode.ERROR,
				message: 'Something went wrong'
			};
		}
	}

	public async subtractLevelUser(userId: string, guildId: string, level: number): Promise<Status> {
		try {
			const userLevel = await this.getUserLevel(userId, guildId);

			if (userLevel.status !== StatusCode.SUCCESS) return userLevel;

			if (!level) level = 1;

			if (level <= 0)
				return {
					status: StatusCode.ERROR,
					message: 'Level must greater than or equals 1'
				};

			await this.container.prisma.userLevel.update({
				where: {
					id: userLevel.data!.id
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
				user: userLevel.data,
				level
			});

			return {
				status: StatusCode.SUCCESS
			};
		} catch (error) {
			this.container.logger.error(error);
			return {
				status: StatusCode.ERROR,
				message: 'Something went wrong'
			};
		}
	}

	public async getLeaderboard(
		guildId: string,
		limit: number = 10
	): Promise<
		Status<
			Prisma.UserLevelGetPayload<{
				include: {
					user: true;
				};
			}>[]
		>
	> {
		try {
			const userLevels = await this.container.prisma.userLevel.findMany({
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

			return {
				status: StatusCode.SUCCESS,
				data: userLevels
			};
		} catch (error) {
			this.container.logger.error(error);
			return {
				status: StatusCode.ERROR,
				message: 'Something went wrong'
			};
		}
	}
}
