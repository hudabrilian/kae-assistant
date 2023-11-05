import { KaeCommand } from '#structures/commands/KaeCommand';
import KaeEmbed from '#structures/embeds/KaeEmbed';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<KaeCommand.Options>({
	description: 'pause the current song',
	preconditions: ['GuildOnly', 'BotInVoice', 'InSameVoice']
})
export class PauseCommand extends KaeCommand {
	public override registerApplicationCommands(registry: KaeCommand.Registry): void {
		registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description));
	}

	public override async chatInputRun(interaction: KaeCommand.ChatInputCommandInteraction): Promise<any> {
		await interaction.deferReply({ ephemeral: true });

		const queue = this.container.player.queues.get(interaction.guild!);

		queue!.node.setPaused(true);

		return interaction.editReply({
			embeds: [new KaeEmbed().setTitle('Paused').setDescription(`The current song has been paused.`)]
		});
	}
}
