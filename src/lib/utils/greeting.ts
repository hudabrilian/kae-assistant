import KaeEmbed from '#lib/structures/embeds/KaeEmbed';
import { StatusCode } from '#lib/types/enum';
import { Status } from '#lib/types/types';
import { Prisma } from '@prisma/client';
import { container } from '@sapphire/framework';
import { APIEmbed, channelMention } from 'discord.js';

export async function generateEmbed({
	welcomeChannel,
	leaveChannel,
	welcomeEmbed,
	leaveEmbed,
	status
}: {
	welcomeChannel?: string;
	leaveChannel?: string;
	welcomeEmbed?: string;
	leaveEmbed?: string;
	status?: boolean;
}): Promise<APIEmbed> {
	return new KaeEmbed()
		.setTitle('Greeting Information')
		.setDescription(`Status: ${status ? 'Enabled ✅' : 'Disabled ❌'}`)
		.addFields(
			{
				name: 'Welcome Channel',
				value: welcomeChannel ? channelMention(welcomeChannel) : 'Not set'
			},
			{
				name: 'Leave Channel',
				value: leaveChannel ? channelMention(leaveChannel) : 'Not set'
			},
			{
				name: 'Welcome Embed',
				value: welcomeEmbed ? `\`${welcomeEmbed}\`` : 'Not set'
			},
			{
				name: 'Leave Embed',
				value: leaveEmbed ? `\`${leaveEmbed}\`` : 'Not set'
			}
		)
		.toJSON();
}

export async function getGreetingsByGuildId(guildId: string): Promise<
	Status<
		Prisma.GreetingGetPayload<{
			select: {
				id: true;
				welcomeChannel: true;
				leaveChannel: true;
				welcomeEmbed: { select: { id: true; name: true } };
				leaveEmbed: { select: { id: true; name: true } };
				enabled: true;
			};
		}>
	>
> {
	try {
		const greetingsData = await container.prisma.greeting.findFirst({
			where: {
				guild: {
					guildId
				}
			},
			select: {
				id: true,
				welcomeChannel: true,
				leaveChannel: true,
				welcomeEmbed: {
					select: {
						id: true,
						name: true
					}
				},
				leaveEmbed: {
					select: {
						id: true,
						name: true
					}
				},
				enabled: true
			}
		});

		if (!greetingsData) return { status: StatusCode.NOT_FOUND, message: 'Greeting not found' };

		return {
			status: StatusCode.SUCCESS,
			data: greetingsData
		};
	} catch (error) {
		container.logger.error(error);
		return {
			status: StatusCode.ERROR,
			message: 'Something went wrong'
		};
	}
}

export async function setWelcomeChannel(
	guildId: string,
	welcomeChannel: string
): Promise<
	Status<Prisma.GreetingGetPayload<{
		select: {
			welcomeChannel: true;
			leaveChannel: true;
			welcomeEmbed: { select: { name: true } };
			leaveEmbed: { select: { name: true } };
			enabled: true;
		};
	}> | null>
> {
	try {
		const greetingData = await getGreetingsByGuildId(guildId);

		if (greetingData.status !== StatusCode.SUCCESS) return greetingData;

		const greeting = await container.prisma.greeting.upsert({
			where: {
				id: greetingData.data!.id
			},
			update: {
				welcomeChannel
			},
			create: {
				guildId,
				welcomeChannel
			},
			select: {
				welcomeChannel: true,
				leaveChannel: true,
				welcomeEmbed: {
					select: {
						name: true
					}
				},
				leaveEmbed: {
					select: {
						name: true
					}
				},
				enabled: true
			}
		});

		return {
			status: StatusCode.SUCCESS,
			data: greeting
		};
	} catch (error) {
		container.logger.error(error);
		return {
			status: StatusCode.ERROR,
			message: 'Something went wrong'
		};
	}
}

export async function setWelcomeEmbed(
	guildId: string,
	welcomeEmbedId: string
): Promise<
	Status<
		Prisma.GreetingGetPayload<{
			select: {
				welcomeChannel: true;
				leaveChannel: true;
				welcomeEmbed: { select: { name: true } };
				leaveEmbed: { select: { name: true } };
				enabled: true;
			};
		}>
	>
> {
	try {
		const greetingData = await getGreetingsByGuildId(guildId);

		if (greetingData.status !== StatusCode.SUCCESS) return greetingData;

		const greeting = await container.prisma.greeting.upsert({
			where: {
				id: greetingData.data!.id
			},
			update: {
				welcomeEmbedId
			},
			create: {
				guildId,
				welcomeEmbedId
			},
			select: {
				welcomeChannel: true,
				leaveChannel: true,
				welcomeEmbed: {
					select: {
						name: true
					}
				},
				leaveEmbed: {
					select: {
						name: true
					}
				},
				enabled: true
			}
		});

		return {
			status: StatusCode.SUCCESS,
			data: greeting
		};
	} catch (error) {
		container.logger.error(error);
		return {
			status: StatusCode.ERROR,
			message: 'Something went wrong'
		};
	}
}

export async function setLeaveChannel(
	guildId: string,
	leaveChannel: string
): Promise<
	Status<
		Prisma.GreetingGetPayload<{
			select: {
				welcomeChannel: true;
				leaveChannel: true;
				welcomeEmbed: { select: { name: true } };
				leaveEmbed: { select: { name: true } };
				enabled: true;
			};
		}>
	>
> {
	try {
		const greetingData = await getGreetingsByGuildId(guildId);

		if (greetingData.status !== StatusCode.SUCCESS) return greetingData;

		const greeting = await container.prisma.greeting.upsert({
			where: {
				id: greetingData.data!.id
			},
			update: {
				leaveChannel
			},
			create: {
				guildId,
				leaveChannel
			},
			select: {
				welcomeChannel: true,
				leaveChannel: true,
				welcomeEmbed: {
					select: {
						name: true
					}
				},
				leaveEmbed: {
					select: {
						name: true
					}
				},
				enabled: true
			}
		});

		return {
			status: StatusCode.SUCCESS,
			data: greeting
		};
	} catch (error) {
		container.logger.error(error);
		return {
			status: StatusCode.ERROR,
			message: 'Something went wrong'
		};
	}
}

export async function setLeaveEmbed(
	guildId: string,
	leaveEmbedId: string
): Promise<
	Status<
		Prisma.GreetingGetPayload<{
			select: {
				welcomeChannel: true;
				leaveChannel: true;
				welcomeEmbed: { select: { name: true } };
				leaveEmbed: { select: { name: true } };
				enabled: true;
			};
		}>
	>
> {
	try {
		const greetingData = await getGreetingsByGuildId(guildId);

		if (greetingData.status !== StatusCode.SUCCESS) return greetingData;

		const greeting = await container.prisma.greeting.upsert({
			where: {
				id: greetingData.data!.id
			},
			update: {
				leaveEmbedId
			},
			create: {
				guildId,
				leaveEmbedId
			},
			select: {
				welcomeChannel: true,
				leaveChannel: true,
				welcomeEmbed: {
					select: {
						name: true
					}
				},
				leaveEmbed: {
					select: {
						name: true
					}
				},
				enabled: true
			}
		});

		return {
			status: StatusCode.SUCCESS,
			data: greeting
		};
	} catch (error) {
		container.logger.error(error);
		return {
			status: StatusCode.ERROR,
			message: 'Something went wrong'
		};
	}
}

export async function changeStatus(
	greetingId: string,
	status: boolean
): Promise<
	Status<
		Prisma.GreetingGetPayload<{
			select: {
				welcomeChannel: true;
				leaveChannel: true;
				welcomeEmbed: { select: { name: true } };
				leaveEmbed: { select: { name: true } };
				enabled: true;
			};
		}>
	>
> {
	try {
		const greeting = await container.prisma.greeting.update({
			where: {
				id: greetingId
			},
			data: {
				enabled: status
			},
			select: {
				welcomeChannel: true,
				leaveChannel: true,
				welcomeEmbed: {
					select: {
						name: true
					}
				},
				leaveEmbed: {
					select: {
						name: true
					}
				},
				enabled: true
			}
		});

		return {
			status: StatusCode.SUCCESS,
			data: greeting
		};
	} catch (error) {
		container.logger.error(error);
		return {
			status: StatusCode.ERROR,
			message: 'Something went wrong'
		};
	}
}
