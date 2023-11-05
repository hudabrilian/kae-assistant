import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { UserLevel } from '@prisma/client';
import { LevelEvents } from '#lib/types/enum';

@ApplyOptions<Listener.Options>({
	event: LevelEvents.SUBTRACT_LEVEL
})
export class LevelsListener extends Listener<typeof LevelEvents.LEVEL_UP> {
	public async run({ user, level }: { user: UserLevel; level: number }): Promise<void> {
		this.container.logger.debug(`[KaeLevel] User ${user.id} lost ${level} level`);
	}
}
