import { Field, Prisma } from '@prisma/client';
import { container } from '@sapphire/framework';

export async function getFieldByGuildId(guildId: string): Promise<{ name: string }[]> {
	try {
		const fields = await container.prisma.field.findMany({
			where: {
				guild: {
					guildId
				}
			},
			select: {
				nameField: true
			}
		});
		return fields.map((field) => ({
			name: field.nameField
		}));
	} catch (error) {
		container.logger.error(error);
		return [];
	}
}

export async function getFieldById(fieldId: string, guildId: string): Promise<Field | null> {
	try {
		const field = await container.prisma.field.findUnique({
			where: {
				id: fieldId,
				guild: {
					guildId
				}
			}
		});
		return field;
	} catch (error) {
		container.logger.error(error);
		return null;
	}
}

export async function getFieldByName(fieldName: string, guildId: string): Promise<Field | null> {
	try {
		const field = await container.prisma.field.findFirst({
			where: {
				nameField: fieldName,
				guild: {
					guildId
				}
			}
		});
		return field;
	} catch (error) {
		container.logger.error(error);
		return null;
	}
}

export async function createField(
	fieldName: string,
	guildId: string,
	data: Omit<Prisma.FieldCreateInput, 'nameField' | 'guildId' | 'guild'>
): Promise<Field | null> {
	try {
		const field = await container.prisma.field.create({
			data: {
				...data,
				nameField: fieldName,
				guild: {
					connect: {
						guildId
					}
				}
			}
		});
		return field;
	} catch (error) {
		container.logger.error(error);
		return null;
	}
}

export async function updateField(fieldId: string, data: Omit<Field, 'id' | 'guildId'>): Promise<Field | null> {
	try {
		const field = await container.prisma.field.update({
			where: {
				id: fieldId
			},
			data
		});
		return field;
	} catch (error) {
		container.logger.error(error);
		return null;
	}
}

export async function removeField(fieldId: string) {
	try {
		await container.prisma.field.delete({
			where: {
				id: fieldId
			}
		});
	} catch (error) {
		container.logger.error(error);
	}
}
