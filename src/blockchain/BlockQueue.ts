import { Connection } from './Connection';

export class Block {
  block: any;
  constructor(block: any) {
    this.block = block;
  }

  getBlockHeight(): number {
    return this.block.header.height;
  }

  hasTransactions(): boolean {
    return (this.block.data.txs.length !== 0);
  }

}

export class NewBlockEvent {
  block: Block;
  constructor(block: any) {
    this.block = new Block(block);
  }

  getBlock() {
    return this.block;
  }

  getBlockHeight(): number {
    return this.getBlock().getBlockHeight();
  }
}

export class BlockQueue {

  conn: Connection;
  curBlock: number;
  callback: Function;
  started: boolean;

  constructor(conn: Connection, startBlock: number) {
    this.conn = conn;
    this.curBlock = startBlock;
    this.started = false;
  }

  onBlock(callback: Function) {
    this.callback = callback;
  }

  async sleep(ms: number = 0) {
    return new Promise(r => setTimeout(r, ms));
  }
  
  async start() {
    this.started = true;
    var noBlocks = false;
    while (this.started) {
      if (noBlocks) {
        await this.sleep(500);
      }
      await this.conn.getBlock(this.curBlock).then( (block) => {
        if (block) {
          this.callback(new NewBlockEvent(block));
          ++this.curBlock;
        } else {
          noBlocks = true;
        }
      });
    }
  }

  stop() {
    this.started = false;
  }
}