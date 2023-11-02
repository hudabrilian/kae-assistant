import { Prisma } from '@prisma/client';
import { container } from '@sapphire/framework';
import { APIEmbed, channelMention } from 'discord.js';
import KaeEmbed from '../structures/embeds/KaeEmbed';

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

export async function getGreetingsByGuildId(guildId: string): Promise<Prisma.GreetingGetPayload<{
	select: {
		id: true;
		welcomeChannel: true;
		leaveChannel: true;
		welcomeEmbed: { select: { name: true } };
		leaveEmbed: { select: { name: true } };
		enabled: true;
	};
}> | null> {
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

		return greetingsData;
	} catch (error) {
		container.logger.error(error);
		return null;
	}
}

export async function setWelcomeChannel(
	guildId: string,
	welcomeChannel: string
): Promise<Prisma.GreetingGetPayload<{
	select: {
		welcomeChannel: true;
		leaveChannel: true;
		welcomeEmbed: { select: { name: true } };
		leaveEmbed: { select: { name: true } };
		enabled: true;
	};
}> | null> {
	try {
		const greetingData = await getGreetingsByGuildId(guildId);

		if (!greetingData) return null;

		const greeting = await container.prisma.greeting.upsert({
			where: {
				id: greetingData.id
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

		return greeting;
	} catch (error) {
		container.logger.error(error);
		return null;
	}
}

export async function setWelcomeEmbed(
	guildId: string,
	welcomeEmbedId: string
): Promise<Prisma.GreetingGetPayload<{
	select: {
		welcomeChannel: true;
		leaveChannel: true;
		welcomeEmbed: { select: { name: true } };
		leaveEmbed: { select: { name: true } };
		enabled: true;
	};
}> | null> {
	try {
		const greetingData = await getGreetingsByGuildId(guildId);

		if (!greetingData) return null;

		const greeting = await container.prisma.greeting.upsert({
			where: {
				id: greetingData.id
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

		return greeting;
	} catch (error) {
		container.logger.error(error);
		return null;
	}
}

export async function setLeaveChannel(
	guildId: string,
	leaveChannel: string
): Promise<Prisma.GreetingGetPayload<{
	select: {
		welcomeChannel: true;
		leaveChannel: true;
		welcomeEmbed: { select: { name: true } };
		leaveEmbed: { select: { name: true } };
		enabled: true;
	};
}> | null> {
	try {
		const greetingData = await getGreetingsByGuildId(guildId);

		if (!greetingData) return null;

		const greeting = await container.prisma.greeting.upsert({
			where: {
				id: greetingData.id
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

		return greeting;
	} catch (error) {
		container.logger.error(error);
		return null;
	}
}

export async function setLeaveEmbed(
	guildId: string,
	leaveEmbedId: string
): Promise<Prisma.GreetingGetPayload<{
	select: {
		welcomeChannel: true;
		leaveChannel: true;
		welcomeEmbed: { select: { name: true } };
		leaveEmbed: { select: { name: true } };
		enabled: true;
	};
}> | null> {
	try {
		const greetingData = await getGreetingsByGuildId(guildId);

		if (!greetingData) return null;

		const greeting = await container.prisma.greeting.upsert({
			where: {
				id: greetingData.id
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

		return greeting;
	} catch (error) {
		container.logger.error(error);
		return null;
	}
}

export async function changeStatus(
	greetingId: string,
	status: boolean
): Promise<Prisma.GreetingGetPayload<{
	select: {
		welcomeChannel: true;
		leaveChannel: true;
		welcomeEmbed: { select: { name: true } };
		leaveEmbed: { select: { name: true } };
		enabled: true;
	};
}> | null> {
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

		return greeting;
	} catch (error) {
		container.logger.error(error);
		return null;
	}
}
