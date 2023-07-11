import parrot from '@ratinchat/parrot.js';
import { PermissionsBitField } from 'discord.js';
import botSchema from '../bot-schema.js';

const command = new parrot.SlashCommand({
    name: 'add-channel',
    description: 'Add a channel to the list of channels that the bot will respond to.',
    args: [
        {
            name: 'channel',
            description: 'The channel to add.',
            required: true,
            type: parrot.Options.Channel
        }
    ],
    execute: async (interaction, { channel }) => {
        const guild = interaction.guild.id;
        var iColor = '#2b2d31';

        // check permissions
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const errorEmbed = new parrot.Embed()
                .setTitle('Error')
                .setDescription('You do not have permission to use this command.')
                .setColor(iColor)
                .setTimestamp();
            return interaction.reply({ embeds: [errorEmbed] });
        } else if (channel.type !== 0) {
            const errorEmbed = new parrot.Embed()
                .setTitle('Error')
                .setDescription('You can only add text channels.')
                .setColor(iColor)
                .setTimestamp();
            return interaction.reply({ embeds: [errorEmbed] });
        } else if (!interaction.client.channels.cache.has(channel.id)) {
            const errorEmbed = new parrot.Embed()
                .setTitle('Error')
                .setDescription('The channel you specified is not in this server.')
                .setColor(iColor)
                .setTimestamp();
            return interaction.reply({ embeds: [errorEmbed] });
        } else if (!channel.permissionsFor(interaction.client.user).has(PermissionsBitField.Flags.SendMessages)) {
            const errorEmbed = new parrot.Embed()
                .setTitle('Error')
                .setDescription('I do not have permission to send messages in that channel.')
                .setColor(iColor)
                .setTimestamp();
            return interaction.reply({ embeds: [errorEmbed] });
        }
        const result = {
            channel: channel.id,
        };

        await botSchema.findOneAndUpdate(
            {
                guildID: guild,
            },
            {
                guildID: guild,
                $push: {
                    channels: result,
                },
            }, {
            upsert: true,
        });

        const successEmbed = new parrot.Embed()
            .setTitle('Success')
            .setDescription(`Added ${channel} to the list of channels that I will respond to.`)
            .setColor(iColor)
            .setTimestamp();
        await interaction.reply({ embeds: [successEmbed] });
    }
});

export { command };