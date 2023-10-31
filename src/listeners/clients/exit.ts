import { Listener, PieceContext } from '@sapphire/framework';

export default class Exit extends Listener {
	public constructor(context: PieceContext) {
		super(context, {
			emitter: process
		});
	}

	public run(): void {
		this.container.logger.fatal('[Kae] Kae has been told to shutdown, so it will.');
		this.container.client.destroy();
		this.container.prisma.$disconnect();
	}
}
