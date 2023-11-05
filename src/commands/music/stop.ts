import { KaeCommand } from '#structures/commands/KaeCommand';
import { ApplyOptions } from '@sapphire/decorators';
import { useQueue } from 'discord-player';

@ApplyOptions<KaeCommand.Options>({
	description: 'stop queue',
	preconditions: ['GuildOnly', 'UserInVoice', 'BotInVoice']
})
export class StopCommand extends KaeCommand {
	public override registerApplicationCommands(registry: KaeCommand.Registry) {
		registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description));
	}

	public override async chatInputRun(interaction: KaeCommand.ChatInputCommandInteraction): Promise<any> {
		const queue = useQueue(interaction.guild!)!;
		queue.delete();

		return interaction.reply('Player stopped');
	}
}
