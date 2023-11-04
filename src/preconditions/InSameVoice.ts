import { Precondition } from '@sapphire/framework';
import { CommandInteraction, GuildMember } from 'discord.js';

export class InSameVoicePrecondition extends Precondition {
	public override async chatInputRun(interaction: CommandInteraction) {
		return interaction.guild!.members.me!.voice.channel!.equals((interaction.member as GuildMember).voice.channel!)
			? this.ok()
			: this.error({
					message: 'You must be in the same voice channel as me to use this command'
			  });
	}
}
