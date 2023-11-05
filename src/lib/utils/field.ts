import { StatusCode } from '#lib/types/enum';
import { Status } from '#lib/types/types';
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

export async function getFieldById(fieldId: string, guildId: string): Promise<Status<Field>> {
	try {
		const field = await container.prisma.field.findUnique({
			where: {
				id: fieldId,
				guild: {
					guildId
				}
			}
		});

		if (!field)
			return {
				status: StatusCode.NOT_FOUND,
				message: 'Field not found'
			};

		return {
			status: StatusCode.SUCCESS,
			data: field
		};
	} catch (error) {
		container.logger.error(error);
		return {
			status: StatusCode.ERROR,
			message: 'Something went wrong'
		};
	}
}

export async function getFieldByName(fieldName: string, guildId: string): Promise<Status<Field>> {
	try {
		const field = await container.prisma.field.findFirst({
			where: {
				nameField: fieldName,
				guild: {
					guildId
				}
			}
		});

		if (!field)
			return {
				status: StatusCode.NOT_FOUND,
				message: 'Field not found'
			};

		return {
			status: StatusCode.SUCCESS,
			data: field
		};
	} catch (error) {
		container.logger.error(error);
		return {
			status: StatusCode.ERROR,
			message: 'Something went wrong'
		};
	}
}

export async function createField(
	fieldName: string,
	guildId: string,
	data: Omit<Prisma.FieldCreateInput, 'nameField' | 'guildId' | 'guild'>
): Promise<Status<Field>> {
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

		return {
			status: StatusCode.SUCCESS,
			data: field
		};
	} catch (error) {
		container.logger.error(error);
		return {
			status: StatusCode.ERROR,
			message: 'Something went wrong'
		};
	}
}

export async function updateField(fieldId: string, data: Omit<Field, 'id' | 'guildId'>): Promise<Status<Field>> {
	try {
		const field = await container.prisma.field.update({
			where: {
				id: fieldId
			},
			data
		});

		return {
			status: StatusCode.SUCCESS,
			data: field
		};
	} catch (error) {
		container.logger.error(error);
		return {
			status: StatusCode.ERROR,
			message: 'Something went wrong'
		};
	}
}

export async function removeField(fieldId: string): Promise<Status<boolean>> {
	try {
		await container.prisma.field.delete({
			where: {
				id: fieldId
			}
		});

		return {
			status: StatusCode.SUCCESS,
			message: 'Successfully removed field'
		};
	} catch (error) {
		container.logger.error(error);
		return {
			status: StatusCode.ERROR,
			message: 'Something went wrong'
		};
	}
}
