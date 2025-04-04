import { Client, Events, GatewayIntentBits } from 'discord.js';
import { SignalService } from './services/signal.service';

export class Bot {
  private client: Client;
  private signalService: SignalService;
  private ignoredChannelId: string | null;

  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
      ]
    });

    this.signalService = new SignalService();
    this.ignoredChannelId = process.env.IGNORED_CHANNEL_ID || null;
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.client.on(Events.ClientReady, () => {
      console.log(`Logged in as ${this.client.user?.tag}`);

      if(this.ignoredChannelId) {
        console.log(`Ignoring join notifications for channel ID: ${this.ignoredChannelId}`);
      }
    });

    this.client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
      if (!oldState.channelId && newState.channelId) {
        const user = newState.member?.user;
        const channel = newState.channel;

        if (!user || !channel) return;
        
        // Skip notification if this is the ignored channel
        if (this.ignoredChannelId && newState.channelId === this.ignoredChannelId) {
          console.log(`Ignoring join notification for channel ID: ${this.ignoredChannelId}`);
          return;
        }

        const emoji = this.getRandomJoinEmoji();
        const message = `${emoji} ${user.username} joined voice channel "${channel.name}" ${emoji}. You should join them!`;

        try {
          await this.signalService.sendMessage(message);
          console.log('Successfully sent message to Signal');
        } catch (error) {
          console.error('Error sending message to Signal:', error);
        }
      }
    });
  }

  private getRandomJoinEmoji(): string {
    const emojis = [
      '🎮', '🎧', '🎵', '🎙️', '🔊', '👋', '💫', '✨', 
      '🚀', '🌟', '🎪', '🎯', '🎲', '🎨', '🎭', '🎪',
      '🎉', '🎊', '🎈', '🎁', '🎤', '🎼', '🎷', '🎸',
    ];
    return emojis[Math.floor(Math.random() * emojis.length)];
  }

  async start(): Promise<void> {
    const token = process.env.DISCORD_TOKEN;
    if (!token) throw new Error('DISCORD_TOKEN not found in environment variables');
    
    await this.client.login(token);
  }
}
