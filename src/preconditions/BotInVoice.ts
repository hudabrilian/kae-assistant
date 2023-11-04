import { Precondition } from '@sapphire/framework';
import { CommandInteraction } from 'discord.js';

export class BotInVoicePrecondition extends Precondition {
	public override async chatInputRun(interaction: CommandInteraction) {
		return interaction.guild!.members.me!.voice.channel ? this.ok() : this.error({ message: "I'm not in a voice channel" });
	}
}
