import { CLIENT_OPTIONS } from '#config';
import { Enumerable } from '@sapphire/decorators';
import { SapphireClient, container } from '@sapphire/framework';
import { Player } from 'discord-player';
import { KaeLevel } from './structures/KaeLevel';
import prismaClient from '#database';

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
