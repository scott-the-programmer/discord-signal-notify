import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class SignalService {
  private readonly signalCliPath: string;
  private readonly phoneNumber: string;
  private readonly groupId: string;

  constructor() {
    const phoneNumber = process.env.SIGNAL_PHONE_NUMBER;
    const groupId = process.env.SIGNAL_GROUP_ID;
    
    if (!phoneNumber || !groupId) {
      throw new Error('SIGNAL_PHONE_NUMBER and SIGNAL_GROUP_ID must be set in environment variables');
    }

    this.phoneNumber = phoneNumber;
    this.groupId = groupId;
    this.signalCliPath = process.env.SIGNAL_CLI_PATH || 'signal-cli';
  }

  async sendMessage(message: string): Promise<void> {
    try {
      const command = [
        this.signalCliPath,
        `-a ${this.phoneNumber}`,
        'send',
        '-g', this.groupId,
        '-m', `"${message.replace(/"/g, '\\"')}"` 
      ].join(' ');

      await execAsync(command);
      console.log('Signal message sent successfully');
    } catch (error) {
      console.error('Failed to send Signal message:', error);
      throw new Error(`Failed to send Signal message: ${error}`);
    }
  }
}
