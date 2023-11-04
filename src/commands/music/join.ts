import { ApplyOptions } from '@sapphire/decorators';
import { GuildMember, PermissionFlagsBits } from 'discord.js';
import { KaeCommand } from '../../lib/structures/commands/KaeCommand';
import KaeEmbed from '../../lib/structures/embeds/KaeEmbed';

@ApplyOptions<KaeCommand.Options>({
	description: 'Let the bot join the voice channel',
	preconditions: ['GuildOnly', 'UserInVoice'],
	requiredClientPermissions: [PermissionFlagsBits.Connect]
})
export class JoinCommand extends KaeCommand {
	public override registerApplicationCommands(registry: KaeCommand.Registry) {
		registry.registerChatInputCommand((builder) => {
			builder.setName(this.name).setDescription(this.description);
		});
	}

	public override async chatInputRun(interaction: KaeCommand.ChatInputCommandInteraction) {
		await interaction.deferReply();
		if (!(await this.joinChannel(interaction))) return;

		return interaction.editReply({
			embeds: [
				new KaeEmbed()
					.setTitle('Joined voice channel!')
					.setDescription(`I have successfully joined ${(interaction.member as GuildMember).voice.channel!.name} voice channel.`)
			]
		});
	}

	/**
	 * Join the voice channel of the interaction member
	 * @param interaction The interaction to get guild data from
	 * @returns The created queue of the interaction guild
	 */
	public async joinChannel(interaction: KaeCommand.ChatInputCommandInteraction) {
		const { member, guild } = interaction;
		const { player } = this.container;
		const { voice } = member as GuildMember;

		const queue = player.nodes.create(guild!, {
			leaveOnEmpty: false,
			leaveOnEnd: false,
			metadata: interaction,
			volume: 60
		});

		try {
			if (!queue.connection) await queue.connect(voice.channel!);
		} catch {
			player.queues.delete(guild!);
			return void interaction.editReply({
				embeds: [new KaeEmbed().setTitle('Could not join your voice channel!').setDescription(`I need the \`CONNECT\` permissions.`)]
			});
		}

		return queue;
	}
}
