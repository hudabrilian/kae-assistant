import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { LevelEvents } from '../../lib/types/enum';
import { UserLevel } from '@prisma/client';

@ApplyOptions<Listener.Options>({
	event: LevelEvents.ADD_XP
})
export class LevelsListener extends Listener<typeof LevelEvents.LEVEL_UP> {
	public async run({ user, xp }: { user: UserLevel; xp: number }): Promise<void> {
		this.container.logger.debug(`[KaeLevel] User ${user.id} gained ${xp} xp`);
	}
}
