import { ethers } from 'ethers';
import { config } from 'dotenv';

config();

// infura API key
const INFURA_ID = process.env.INFURA_ID;

// 连接以太坊主网
const provider = new ethers.JsonRpcProvider(
  `https://sepolia.infura.io/v3/${INFURA_ID}`
);

// 创建随机的wallet对象
const wallet1 = ethers.Wallet.createRandom();
const wallet1WithProvider = wallet1.connect(provider);
const mnemonic = wallet1.mnemonic; // 获取助记词

// 利用私钥和provider创建wallet对象
const privateKey = 'x'; // 钱包账户私钥地址
const wallet2 = new ethers.Wallet(privateKey, provider);

// 从助记词创建wallet对象
const wallet3 = ethers.Wallet.fromPhrase(mnemonic.phrase);

const main = async () => {
  // 1. 获取钱包地址
  const address1 = await wallet1.getAddress();
  const address2 = await wallet2.getAddress();
  const address3 = await wallet3.getAddress(); // 获取地址
  console.log(`1. 获取钱包地址`);
  console.log(`钱包1地址: ${address1}`);
  console.log(`钱包2地址: ${address2}`);
  console.log(`钱包3地址: ${address3}`);
  console.log(`钱包1和钱包3的地址是否相同: ${address1 === address3}`);

  // 2. 获取助记词
  console.log(`\n2. 获取助记词`);
  console.log(`钱包1助记词: ${wallet1.mnemonic.phrase}`);
  // 注意：从private key生成的钱包没有助记词
  // console.log(wallet2.mnemonic.phrase)

  // 3. 获取私钥
  console.log(`\n3. 获取私钥`);
  console.log(`钱包1私钥: ${wallet1.privateKey}`);
  console.log(`钱包2私钥: ${wallet2.privateKey}`);

  // 4. 获取链上发送交易次数
  console.log(`\n4. 获取链上交易次数`);
  const txCount1 = await provider.getTransactionCount(wallet1WithProvider);
  const txCount2 = await provider.getTransactionCount(wallet2);
  console.log(`钱包1发送交易次数: ${txCount1}`);
  console.log(`钱包2发送交易次数: ${txCount2}`);

  // 5. 发送ETH
  console.log(`\n5. 发送ETH（测试网）`);
  // i. 打印交易前的余额
  console.log(`i. 发送前余额`);
  console.log(
    `钱包1: ${ethers.formatEther(
      await provider.getBalance(wallet1WithProvider)
    )} ETH`
  );
  console.log(
    `钱包2: ${ethers.formatEther(await provider.getBalance(wallet2))} ETH`
  );
  // ii. 构造交易请求，参数：to为接收地址，value为ETH数额
  const tx = {
    to: address1,
    value: ethers.parseEther('0.01'),
  };
  // iii. 发送交易，获得数据
  console.log(`\nii. 等待交易在区块链确认（需要几分钟）`);
  const receipt = await wallet2.sendTransaction(tx); // receipt 收据
  await receipt.wait(); // 等待链上确认交易
  console.log(receipt); // 打印交易详情
  // iv. 打印交易后的余额
  console.log(`\niii. 发送后余额`);
  console.log(
    `钱包1: ${ethers.formatEther(
      await provider.getBalance(wallet1WithProvider)
    )} ETH`
  );
  console.log(
    `钱包2: ${ethers.formatEther(await provider.getBalance(wallet2))} ETH`
  );
};

main();
