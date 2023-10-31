import './lib/setup';

import { container } from '@sapphire/framework';
import KaeClient from './lib/KaeClient';

const client = new KaeClient();

const main = async () => {
	try {
		client.logger.info('Logging in');
		await client.login();
		client.logger.info('logged in');
	} catch (error) {
		client.logger.fatal(error);
		client.destroy();
		process.exit(1);
	}
};

main().catch(container.logger.error.bind(container.logger));
