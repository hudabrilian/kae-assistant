import { KaeLevel } from '#lib/structures/KaeLevel';
import { PrismaClient } from '@prisma/client';
import { ArrayString } from '@skyra/env-utilities';
import { Player } from 'discord-player';

declare module '@sapphire/pieces' {
	interface Container {
		prisma: PrismaClient;
		level: KaeLevel;
		player: Player;
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		BotOwner: never;
		UserInVoice: never;
		InSameVoice: never;
		BotInVoice: never;
	}
}

declare module '@skyra/env-utilities' {
	export interface Env {
		CLIENT_NAME: string;
		CLIENT_VERSION: string;
		CLIENT_PREFIX: string;
		CLIENT_OWNERS: ArrayString;
		CLIENT_ID: string;

		DISCORD_TOKEN: string;

		DATABASE_URL: string;
	}
}
