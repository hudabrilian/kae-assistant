import { ApplyOptions } from '@sapphire/decorators';
import { KaeCommand } from '../../lib/structures/commands/KaeCommand';
import KaeEmbed from '../../lib/structures/embeds/KaeEmbed';

@ApplyOptions<KaeCommand.Options>({
	description: 'set the volume of the player',
	preconditions: ['GuildOnly', 'BotInVoice', 'InSameVoice']
})
export class VolumeCommand extends KaeCommand {
	public override registerApplicationCommands(registry: KaeCommand.Registry): void {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addIntegerOption((input) =>
					input.setName('volume').setDescription('the volume to set the player to').setMinValue(10).setMaxValue(200).setRequired(false)
				)
		);
	}

	public override async chatInputRun(interaction: KaeCommand.ChatInputCommandInteraction): Promise<any> {
		await interaction.deferReply();

		const volume = interaction.options.getInteger('volume');
		const queue = this.container.player.nodes.get(interaction.guild!)!;

		if (!volume) {
			return interaction.editReply({
				embeds: [new KaeEmbed().setTitle('Volume').setDescription(`The current volume is ${queue.node.volume}.`)]
			});
		}

		queue.node.setVolume(volume);

		return interaction.editReply({
			embeds: [new KaeEmbed().setTitle('Volume').setDescription(`The volume has been set to ${volume}.`)]
		});
	}
}
