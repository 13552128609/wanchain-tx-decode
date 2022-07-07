const wanUtil = require('wanchain-util')
const Tx = wanUtil.wanchainTx;
const rlp = require('rlp')
const ethers = require('ethers')

exports.decodeWanRawTran = function(raw){
  if("0x02" === raw.slice(0,4)) { // eip1559
    return  ethers.utils.parseTransaction(raw)
  } else  {
    let rlp1 = rlp.decode(raw)
    if(rlp1.length == 9) { // eth lagacy
      return  ethers.utils.parseTransaction(raw)
    } else if(rlp1.length == 10) {
      if(Buffer.from(rlp1[0]).toString('hex') === 'ffffffff') { // wanjupiter
        let rlp1 = rlp.decode(raw)
        let rlp2 = rlp1.slice(1)
        let raw3 = rlp.encode(rlp2)
        return  ethers.utils.parseTransaction(raw3)
      } else { //wan lagacy
        const tx = new Tx(raw)
        let tx2 = tx.toJSON(true)
        tx2.from = '0x'+tx.from.toString('hex')
        return tx2
      }
    } else {
      console.log("unknown tx")
      return {}
    }
  }
}
