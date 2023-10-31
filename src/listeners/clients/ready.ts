import { ApplyOptions } from '@sapphire/decorators';
import { Listener, Store } from '@sapphire/framework';
import { DEV } from '../../config';
import { blue, gray, green, magenta, magentaBright, white, yellow } from 'colorette';
import { initializeGuild } from '../../lib/utils/functions/initialize';

@ApplyOptions<Listener.Options>({ once: true })
export class UserEvent extends Listener {
	private readonly style = DEV ? yellow : blue;

	public override async run() {
		this.printBanner();
		this.printStoreDebugInformation();

		await this.guildValidation();
	}

	private async guildValidation() {
		const { client, logger } = this.container;

		logger.info('[Kae] Starting guild validation...');

		for (const guildCollection of client.guilds.cache) {
			const guild = guildCollection[1];
			await initializeGuild(guild);
		}

		logger.info('[Kae] All guilds validated!');
	}

	private printBanner() {
		const success = green('+');

		const llc = DEV ? magentaBright : white;
		const blc = DEV ? magenta : blue;

		const line01 = llc('');
		const line02 = llc('');
		const line03 = llc('');

		// Offset Pad
		const pad = ' '.repeat(7);

		console.log(
			String.raw`
${line01} ${pad}${blc('1.0.0')}
${line02} ${pad}[${success}] Gateway
${line03}${DEV ? ` ${pad}${blc('<')}${llc('/')}${blc('>')} ${llc('DEVELOPMENT MODE')}` : ''}
		`.trim()
		);
	}

	private printStoreDebugInformation() {
		const { client, logger } = this.container;
		const stores = [...client.stores.values()];
		const last = stores.pop()!;

		for (const store of stores) logger.info(this.styleStore(store, false));
		logger.info(this.styleStore(last, true));
	}

	private styleStore(store: Store<any>, last: boolean) {
		return gray(`${last ? '└─' : '├─'} Loaded ${this.style(store.size.toString().padEnd(3, ' '))} ${store.name}.`);
	}
}
