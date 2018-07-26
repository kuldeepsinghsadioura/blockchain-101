const SHA256=require("crypto-js/sha256");

class Block{
    constructor(index, timestamp,data, previousHash=''){
        this.index=index;
        this.timestamp=timestamp;
        this.data=data;
        this.previousHash=previousHash;
        this.hash=this.calculateHash();
        this.nonce=0;
    }
    calculateHash(){
        return SHA256(this.index+this.previousHash+this.timestamp+JSON.stringify(this.data)).toString();
    }
    mindBlock(difficulty){
        while(this.hash.substring(0,difficulty)!==Array(difficulty+1).join("90")){
            this.nonce++;
            this.hash=this.calculateHash();
        }
        console.log("Block mined: "+this.hash)
    }
}
class BlockChan{
    constructor(){
        this.chain=[this.createGenesisBlock()];
    }
    createGenesisBlock(){
        return new Block(0,"01/02/2018","Genesis Block","0");
    }
    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }
    addBlock(newBlock){
        newBlock.previousHash= this.getLatestBlock().hash;
        newBlock.hash=   newBlock.calculateHash();
        this.chain.push(newBlock);
    }
    isChainValid(){
        for(let i=1;i<this.chain.length;i++){
            const currentBlock=this.chain[i];
            const prevBlock=this.chain[i-1];
            if(currentBlock.hash!=currentBlock.calculateHash()){
                return false;
            }
            if(currentBlock.previousHash!== prevBlock.hash){
                return false;
            }
        }
        return true;
    }

}

let kdCoin= new BlockChan();
kdCoin.addBlock(new Block(1,"03/02/2018",{amout: 4}));
kdCoin.addBlock(new Block(2,"04/02/2018",{amout: 8}));
kdCoin.addBlock(new Block(3,"05/02/2018",{amout: 9}));
console.log("Is block chain valid"+kdCoin.isChainValid());

kdCoin.chain[1].data={amount : 100};
kdCoin.chain[1].hash=kdCoin.chain[1].calculateHash();
console.log("Is block chain valid"+kdCoin.isChainValid());


//console.log(JSON.stringify(kdCoin, null, 4));