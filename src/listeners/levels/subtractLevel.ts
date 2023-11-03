import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { LevelEvents } from '../../lib/types/enum';
import { UserLevel } from '@prisma/client';

@ApplyOptions<Listener.Options>({
	event: LevelEvents.SUBTRACT_LEVEL
})
export class LevelsListener extends Listener<typeof LevelEvents.LEVEL_UP> {
	public async run({ user, level }: { user: UserLevel; level: number }): Promise<void> {
		this.container.logger.debug(`[KaeLevel] User ${user.id} lost ${level} level`);
	}
}
