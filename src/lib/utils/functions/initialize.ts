import { container } from '@sapphire/framework';
import { bold, gray } from 'colorette';
import { Guild } from 'discord.js';

export async function initializeGuild(guild: Guild) {
	const { logger, prisma } = container;

	const guildInfo = await prisma.guild.findUnique({
		where: {
			guildId: guild.id
		}
	});

	if (guildInfo) return;

	logger.debug(`Initializing guild ${bold(guild.name)} (${gray(guild.id)})`);

	await prisma.guild
		.create({
			data: {
				guildId: guild.id
			}
		})
		.catch((e) => {
			logger.error(`Failed to initialize guild info for ${bold(guild.name)} (${gray(guild.id)}), error below.`);
			logger.error(e);
		});

	logger.debug(`Verified initialization of guild ${bold(guild.name)} (${gray(guild.id)})`);
}
