import { container } from '@sapphire/framework';
import { ReactionRole } from '@prisma/client';
import { Status } from '#lib/types/types';
import { StatusCode } from '#lib/types/enum';

export async function addReactionRole(roleId: string, emojiId: string, guildId: string, message: string): Promise<Status<ReactionRole>> {
	try {
		const reactionRole = await container.prisma.reactionRole.create({
			data: {
				guild: {
					connect: {
						id: guildId
					}
				},
				role: roleId,
				emoji: emojiId,
				message
			}
		});

		return {
			status: StatusCode.SUCCESS,
			data: reactionRole
		};
	} catch (error) {
		container.logger.error(error);
		return {
			status: StatusCode.ERROR,
			message: 'Something went wrong'
		};
	}
}

export async function getReactionRole(roleId: string, emojiId: string, guildId: string): Promise<Status<ReactionRole>> {
	try {
		const reactionRole = await container.prisma.reactionRole.findFirst({
			where: {
				role: roleId,
				emoji: emojiId,
				guildId
			}
		});

		if (!reactionRole)
			return {
				status: StatusCode.NOT_FOUND,
				message: 'Reaction role not found'
			};

		return {
			status: StatusCode.SUCCESS,
			data: reactionRole
		};
	} catch (error) {
		container.logger.error(error);
		return {
			status: StatusCode.ERROR,
			message: 'Something went wrong'
		};
	}
}

export async function getReactionRoleByEmojiId(emojiId: string, guildId: string): Promise<Status<ReactionRole>> {
	try {
		const reactionRole = await container.prisma.reactionRole.findFirst({
			where: {
				emoji: emojiId,
				guild: {
					guildId
				}
			}
		});

		if (!reactionRole)
			return {
				status: StatusCode.NOT_FOUND,
				message: 'Reaction role not found'
			};

		return {
			status: StatusCode.SUCCESS,
			data: reactionRole
		};
	} catch (error) {
		container.logger.error(error);
		return {
			status: StatusCode.ERROR,
			message: 'Something went wrong'
		};
	}
}

export async function getReactionRoles(guildId: string): Promise<Status<ReactionRole[]>> {
	try {
		const reactionRoles = await container.prisma.reactionRole.findMany({
			where: {
				guild: {
					guildId
				}
			}
		});

		return {
			status: StatusCode.SUCCESS,
			data: reactionRoles
		};
	} catch (error) {
		container.logger.error(error);
		return {
			status: StatusCode.ERROR,
			message: 'Something went wrong'
		};
	}
}
