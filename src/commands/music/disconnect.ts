import { ApplyOptions } from '@sapphire/decorators';
import { KaeCommand } from '../../lib/structures/commands/KaeCommand';
import KaeEmbed from '../../lib/structures/embeds/KaeEmbed';

@ApplyOptions<KaeCommand.Options>({
	description: 'Disconnects the bot from the voice channel',
	preconditions: ['GuildOnly', 'BotInVoice']
})
export class DisconnectCommand extends KaeCommand {
	public override registerApplicationCommands(registry: KaeCommand.Registry): void {
		registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description));
	}

	public override async chatInputRun(interaction: KaeCommand.ChatInputCommandInteraction) {
		await interaction.deferReply();

		const { guild } = interaction;
		const { channel } = guild!.members.me!.voice;

		this.container.player.queues.delete(guild!);

		return interaction.editReply({
			embeds: [new KaeEmbed().setTitle('Disconnected').setDescription(`I have disconnected from <#${channel!.name}>`)]
		});
	}
}
