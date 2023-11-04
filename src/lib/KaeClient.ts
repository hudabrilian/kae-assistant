import { Enumerable } from '@sapphire/decorators';
import { SapphireClient, container } from '@sapphire/framework';
import { CLIENT_OPTIONS } from '../config';
import prismaClient from './database';
import { KaeLevel } from './structures/KaeLevel';
import { Player } from 'discord-player';

export default class KaeClient extends SapphireClient {
	@Enumerable(false)
	public dev = process.env.NODE_ENV !== 'production';

	public constructor() {
		super(CLIENT_OPTIONS);

		container.prisma = prismaClient;
		container.level = new KaeLevel();
		container.player = new Player(this, {
			skipFFmpeg: true
		});
	}

	public override async login(token?: string) {
		return super.login(token);
	}

	public override destroy() {
		return super.destroy();
	}
}
