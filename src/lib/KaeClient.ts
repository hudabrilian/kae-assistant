import { Enumerable } from '@sapphire/decorators';
import { SapphireClient, container } from '@sapphire/framework';
import { CLIENT_OPTIONS } from '../config';
import prismaClient from './database';
import { KaeLevel } from './structures/KaeLevel';

export default class KaeClient extends SapphireClient {
	@Enumerable(false)
	public dev = process.env.NODE_ENV !== 'production';

	public constructor() {
		super(CLIENT_OPTIONS);

		container.prisma = prismaClient;
		container.level = new KaeLevel();
	}

	public override async login(token?: string) {
		return super.login(token);
	}

	public override destroy() {
		return super.destroy();
	}
}
