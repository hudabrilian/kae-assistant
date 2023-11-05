import { KaeCommand } from '#lib/structures/commands/KaeCommand';
import KaeEmbed from '#lib/structures/embeds/KaeEmbed';
import { StatusCode } from '#lib/types/enum';
import { Status } from '#lib/types/types';
import { Embed, Prisma } from '@prisma/client';
import { container } from '@sapphire/framework';
import { APIEmbed, ColorResolvable, EmbedField, GuildMember } from 'discord.js';
import { formatText } from './function';

export async function getEmbedsByGuildId(guildId: string): Promise<{ id: string; name: string }[]> {
	try {
		const embeds = await container.prisma.embed.findMany({
			where: {
				guild: {
					guildId
				}
			},
			select: {
				id: true,
				name: true
			}
		});
		return embeds;
	} catch (error) {
		container.logger.error(error);
		return [];
	}
}

export async function getFieldsOnEmbedByName(embedName: string): Promise<{ name: string }[]> {
	try {
		const fields = await container.prisma.embed.findFirst({
			where: {
				name: embedName
			},
			select: {
				fields: {
					select: {
						nameField: true
					}
				}
			}
		});

		return fields!.fields.map((field) => ({
			name: field.nameField
		}));
	} catch (error) {
		container.logger.error(error);
		return [];
	}
}

export async function getEmbedById(embedId: string, guildId: string): Promise<Status<Prisma.EmbedGetPayload<{ include: { fields: true } }>>> {
	try {
		const embed = await container.prisma.embed.findUnique({
			where: {
				id: embedId,
				guild: {
					guildId
				}
			},
			include: {
				fields: true
			}
		});

		if (!embed) {
			return {
				status: StatusCode.NOT_FOUND,
				message: 'Embed not found'
			};
		}

		return {
			status: StatusCode.SUCCESS,
			data: embed
		};
	} catch (error) {
		container.logger.error(error);
		return {
			status: StatusCode.ERROR,
			message: 'Something went wrong'
		};
	}
}

export async function getEmbedByName(embedName: string, guildId: string): Promise<Status<Embed>> {
	try {
		const embed = await container.prisma.embed.findFirst({
			where: {
				name: embedName,
				guild: {
					guildId
				}
			}
		});

		if (!embed) {
			return {
				status: StatusCode.NOT_FOUND,
				message: 'Embed not found'
			};
		}

		return {
			status: StatusCode.SUCCESS,
			data: embed
		};
	} catch (error) {
		container.logger.error(error);
		return {
			status: StatusCode.ERROR,
			message: 'Something went wrong'
		};
	}
}

export async function createEmbed(embedName: string, guildId: string): Promise<Status<Embed>> {
	try {
		const embed = await container.prisma.embed.create({
			data: {
				name: embedName,
				guild: {
					connect: {
						guildId
					}
				}
			}
		});

		return {
			status: StatusCode.SUCCESS,
			data: embed
		};
	} catch (error) {
		container.logger.error(error);
		return {
			status: StatusCode.ERROR,
			message: 'Something went wrong'
		};
	}
}

export async function updateEmbed(embedId: string, data: Omit<Embed, 'id' | 'guildId'>): Promise<Status<Embed>> {
	try {
		const embed = await container.prisma.embed.update({
			where: {
				id: embedId
			},
			data
		});

		return {
			status: StatusCode.SUCCESS,
			data: embed
		};
	} catch (error) {
		container.logger.error(error);
		return {
			status: StatusCode.ERROR,
			message: 'Something went wrong'
		};
	}
}

export async function generateEmbed(embedId: string, interaction: KaeCommand.ChatInputCommandInteraction | GuildMember): Promise<Status<APIEmbed>> {
	const embedData = await getEmbedById(embedId, interaction.guild!.id!);

	if (embedData.status !== StatusCode.SUCCESS) return embedData;

	const embed = new KaeEmbed();

	if (embedData.data!.title) embed.setTitle(formatText(embedData.data!.title, interaction));

	if (embedData.data!.url) embed.setURL(embedData.data!.url);

	if (embedData.data!.author || embedData.data!.authorIconURL || embedData.data!.authorURL) {
		var authorIcon = embedData.data!.authorIconURL as string;

		if (embedData.data!.authorIconURL && embedData.data!.authorIconURL === 'user_avatar') {
			authorIcon = interaction.user.displayAvatarURL();
		}

		if (embedData.data!.author && embedData.data!.authorIconURL && embedData.data!.authorURL) {
			embed.setAuthor({
				name: formatText(embedData.data!.author as string, interaction),
				iconURL: authorIcon,
				url: embedData.data!.authorURL as string
			});
		}

		if (embedData.data!.author && !embedData.data!.authorIconURL && !embedData.data!.authorURL) {
			embed.setAuthor({
				name: formatText(embedData.data!.author as string, interaction)
			});
		}

		if (embedData.data!.author && embedData.data!.authorIconURL && !embedData.data!.authorURL) {
			embed.setAuthor({
				name: formatText(embedData.data!.author as string, interaction),
				iconURL: authorIcon
			});
		}

		if (embedData.data!.author && !embedData.data!.authorIconURL && embedData.data!.authorURL) {
			embed.setAuthor({
				name: formatText(embedData.data!.author as string, interaction),
				url: embedData.data!.authorURL as string
			});
		}
	}

	embed.setDescription(embedData.data!.description ? formatText(embedData.data!.description, interaction) : 'Not setting up');

	if (embedData.data!.color) embed.setColor(embedData.data!.color as ColorResolvable);

	if (embedData.data!.footer || embedData.data!.footerIconURL) {
		if (embedData.data!.footer && embedData.data!.footerIconURL) {
			embed.setFooter({
				text: formatText(embedData.data!.footer, interaction),
				iconURL: embedData.data!.footerIconURL
			});
		}

		if (embedData.data!.footer && !embedData.data!.footerIconURL) {
			embed.setFooter({
				text: formatText(embedData.data!.footer, interaction)
			});
		}
	}

	if (embedData.data!.thumbnail) embed.setThumbnail(embedData.data!.thumbnail);

	if (embedData.data!.image) embed.setImage(embedData.data!.image);

	if (embedData.data!.timestamp) embed.setTimestamp(new Date());

	let fields: EmbedField[] = [];
	for (const field of embedData.data!.fields) {
		fields.push({
			name: formatText(field.name as string, interaction),
			value: formatText(field.value as string, interaction),
			inline: field.inline as boolean
		});
	}

	if (fields.length > 0) embed.addFields(fields);

	return {
		status: StatusCode.SUCCESS,
		data: embed.toJSON()
	};
}

export async function removeEmbed(embedId: string): Promise<Status> {
	try {
		await container.prisma.embed.delete({
			where: {
				id: embedId
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

export async function addField(embedId: string, fieldId: string): Promise<Status> {
	try {
		await container.prisma.embed.update({
			where: {
				id: embedId
			},
			data: {
				fields: {
					connect: {
						id: fieldId
					}
				}
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

export async function removeField(embedId: string, fieldId: string): Promise<Status> {
	try {
		await container.prisma.embed.update({
			where: {
				id: embedId
			},
			data: {
				fields: {
					disconnect: {
						id: fieldId
					}
				}
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
