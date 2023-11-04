import { Precondition } from '@sapphire/framework';
import { CommandInteraction, GuildMember } from 'discord.js';

export class UserInVoicePrecondition extends Precondition {
	public override async chatInputRun(interaction: CommandInteraction) {
		return (interaction.member as GuildMember).voice.channel
			? this.ok()
			: this.error({
					message: 'You must be in a voice channel to use this command.'
			  });
	}
}
