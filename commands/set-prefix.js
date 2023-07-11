import parrot from '@ratinchat/parrot.js';
import { PermissionsBitField } from 'discord.js';
import botSchema from '../bot-schema.js';

const command = new parrot.SlashCommand({
    name: 'set-prefix',
    description: 'Set the ignore prefix for the bot.',
    args: [
        {
            name: 'prefix',
            description: 'The prefix to set.',
            type: parrot.Options.String,
            required: true
        }
    ],
    execute: async (interaction, { prefix }) => {
        var iColor = '#2b2d31';
        const guild = interaction.guild.id;

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const errorEmbed = new parrot.Embed()
                .setTitle('Error')
                .setDescription('You do not have permission to use this command.')
                .setColor(iColor)
                .setTimestamp();
            return interaction.reply({ embeds: [errorEmbed] });
        }

        await botSchema.findOneAndUpdate(
            {
                guildID: guild,
            },
            {
                guildID: guild,
                prefix: prefix,
            }, {
            upsert: true,
        });

        const successEmbed = new parrot.Embed()
            .setTitle('Success')
            .setDescription(`Set the ignore prefix to \`${prefix}\`. The bot will now ignore any message that starts with that prefix.`)
            .setColor(iColor)
            .setTimestamp();
        return interaction.reply({ embeds: [successEmbed] });
    }
});

export { command };