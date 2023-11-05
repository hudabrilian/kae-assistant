import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { UserLevel } from '@prisma/client';
import { LevelEvents } from '#lib/types/enum';

@ApplyOptions<Listener.Options>({
	event: LevelEvents.SUBTRACT_XP
})
export class LevelsListener extends Listener<typeof LevelEvents.LEVEL_UP> {
	public async run({ user, xp }: { user: UserLevel; xp: number }): Promise<void> {
		this.container.logger.debug(`[KaeLevel] User ${user.id} lost ${xp} xp`);
	}
}
