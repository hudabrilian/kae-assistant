import { ApplyOptions } from '@sapphire/decorators';
import { Command, Events, Listener } from '@sapphire/framework';

@ApplyOptions<Listener.Options>({
	event: Events.CommandApplicationCommandRegistryError
})
export class ErrorListener extends Listener<typeof Events.CommandApplicationCommandRegistryError> {
	public async run(error: Error, command: Command): Promise<void> {
		const { name, location } = command;

		this.container.logger.fatal(`[Error] ${name} . ${location} . ${error}`);
	}
}
