import { Client, GatewayIntentBits } from 'discord.js';
import { SignalService } from './services/signal.service';

export class Bot {
  private client: Client;
  private signalService: SignalService;

  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
      ]
    });

    this.signalService = new SignalService();
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.client.on('ready', () => {
      console.log(`Logged in as ${this.client.user?.tag}`);
    });

    this.client.on('voiceStateUpdate', async (oldState, newState) => {
      if (!oldState.channelId && newState.channelId) {
        const user = newState.member?.user;
        const channel = newState.channel;

        if (!user || !channel) return;

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
      '🚀', '🌟', '🎪', '🎯', '🎲', '🎨', '🎭', '🎪'
    ];
    return emojis[Math.floor(Math.random() * emojis.length)];
  }

  async start(): Promise<void> {
    const token = process.env.DISCORD_TOKEN;
    if (!token) throw new Error('DISCORD_TOKEN not found in environment variables');
    
    await this.client.login(token);
  }
}